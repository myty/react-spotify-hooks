import { useCallback, useState } from 'react';

const localStorageKey = 'spotify_auth';

export interface UseTokenState {
    tokenType?: string;
    accessToken?: string;
}

export default function useToken() {
    const [{ accessToken, tokenType }, setState] = useState<UseTokenState>(
        () => {
            const spotifyAuth = localStorage.getItem(localStorageKey);

            if (spotifyAuth != null) {
                return { ...JSON.parse(spotifyAuth) };
            }

            return {};
        }
    );

    const setToken = useCallback((tokenType: string, accessToken: string) => {
        localStorage.setItem(
            localStorageKey,
            JSON.stringify({
                tokenType,
                accessToken,
            })
        );

        setState(prev => ({ ...prev, tokenType, accessToken }));
    }, []);

    return {
        accessToken,
        setToken,
        tokenType,
    };
}
