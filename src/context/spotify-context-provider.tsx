import * as React from 'react';
import { useEffect } from 'react';
import { setAccessToken } from './spotify-authentication';

interface ISpotifyContext {
    clientId: string;
    scope: string;
}

interface SpotifyContextProviderProps extends ISpotifyContext {
    onError: (err: any) => any;
}

export const SpotifyContext = React.createContext<ISpotifyContext>({
    clientId: '',
    scope: '',
});

export function SpotifyContextProvider({
    children,
    clientId,
    onError,
    scope,
}: React.PropsWithChildren<SpotifyContextProviderProps>) {
    useEffect(() => {
        const handleWindowLocationChange = () => {
            try {
                const params = window.location.hash
                    .substr(2)
                    .split('&')
                    .map(v => v.split('='))
                    .reduce<any>(
                        (pre, [key, value]) => ({ ...pre, [key]: value }),
                        {}
                    );

                if (!!params.token_type && !!params.access_token) {
                    setAccessToken(params.token_type, params.access_token);

                    if (params.state) {
                        const state = decodeURIComponent(params.state);
                        const { redirect_uri: redirectUri } = JSON.parse(state);

                        if (redirectUri) {
                            window.location.href = redirectUri;
                        }
                    }
                }
            } catch (err) {
                onError(err);
            }
        };

        window.addEventListener('popstate', handleWindowLocationChange);
        handleWindowLocationChange();

        return () => {
            window.removeEventListener('popstate', handleWindowLocationChange);
        };
    }, [onError]);

    return (
        <SpotifyContext.Provider value={{ clientId, scope }}>
            {children}
        </SpotifyContext.Provider>
    );
}
