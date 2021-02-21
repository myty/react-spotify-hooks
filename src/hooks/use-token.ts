import { useReducer, useRef } from 'react';

const localStorageKey = 'spotify_auth';

interface UseTokenState {
    tokenType?: string;
    accessToken?: string;
}

type UseTokenStateActions = { type: 'Update' } & UseTokenState;

const initializeState = (state: UseTokenState): UseTokenState => {
    const spotifyAuth = localStorage.getItem(localStorageKey);

    if (spotifyAuth != null) {
        return { ...state, ...JSON.parse(spotifyAuth) };
    }

    return state;
};

const reducer = (
    state: UseTokenState,
    action: UseTokenStateActions
): UseTokenState => {
    switch (action.type) {
        case 'Update':
            const { accessToken, tokenType } = action;

            localStorage.setItem(
                localStorageKey,
                JSON.stringify({
                    tokenType,
                    accessToken,
                })
            );

            return { ...state, accessToken, tokenType };
        default:
            return state;
    }
};

export default function useToken() {
    const [state, dispatch] = useReducer(reducer, {}, initializeState);

    const setToken = useRef((tokenType: string, accessToken: string) =>
        dispatch({ type: 'Update', tokenType, accessToken })
    );

    return {
        ...state,
        setToken: setToken.current,
    };
}
