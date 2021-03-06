import { register, ValueChangedEvent } from '@lwc/wire-service';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers';

// TODO: Remove this in production
const loggerMiddleware = store => next => action => {
    /* eslint-disable no-console */
    console.group(action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
    /* eslint-enable no-console */
};

const debounce = (fn, duration) => {
    let timer;
    return function(...args) {
        const thisValue = this;

        if (timer) {
            clearTimeout(timer);
        }

        setTimeout(() => {
            fn.apply(thisValue, args);
            timer = null;
        }, duration);
    };
};

export const store = createStore(
    combineReducers(reducers),
    // loadState(),
    applyMiddleware(thunk, loggerMiddleware),
);

store.subscribe(
    debounce(() => {
        // saveState(store.getState());
    }, 1000),
);

export function connectStore(store) {
    return store.getState();
}

register(connectStore, eventTarget => {
    let store;
    let subscription;

    const notifyStateChange = () => {
        const state = store.getState();
        eventTarget.dispatchEvent(new ValueChangedEvent(state));
    };

    eventTarget.addEventListener('connect', () => {
        subscription = store.subscribe(notifyStateChange);
        notifyStateChange();
    });

    // TODO: This is never invoked, we need to understand why.
    eventTarget.addEventListener('disconnect', () => {
        if (subscription) {
            subscription();
        }
    });

    eventTarget.addEventListener('config', config => {
        store = config.store;
    });
});

export {
    listenEpisode,
    play,
    pause,
    ended,
    subscribe,
    unsubscribe,
    fetchPodcastIfNeeded,
    fetchTopPodcastsIfNeeded,
    fetchSubscribedPodcastsIfNeeded,
} from './actions';
