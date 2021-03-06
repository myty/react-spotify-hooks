import useToken from '../hooks/use-token';
import * as React from 'react';

interface ISpotifyContext {
    clientId: string;
    onError: (err: any) => any;
    scope: string;
}

export const SpotifyContext = React.createContext<ISpotifyContext>({
    clientId: '',
    onError: () => {},
    scope: '',
});

export function SpotifyContextProvider({
    children,
    clientId,
    onError,
    scope,
}: React.PropsWithChildren<ISpotifyContext>) {
    const { setToken } = useToken();

    try {
        const params = window.location.hash
            .substr(1)
            .split('&')
            .map(v => v.split('='))
            .reduce<any>((pre, [key, value]) => ({ ...pre, [key]: value }), {});

        if (!!params.token_type && !!params.access_token) {
            setToken(params.token_type, params.access_token);

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

    return (
        <SpotifyContext.Provider value={{ clientId, onError, scope }}>
            {children}
        </SpotifyContext.Provider>
    );
}
