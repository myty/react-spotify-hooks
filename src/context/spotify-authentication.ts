import buildUrl from 'build-url';

const localStorageKey = 'spotify_auth';
const spotifyAccountsUrl = 'https://accounts.spotify.com';
const responseType = 'token';

export function authenticate(clientId: string, scope: string) {
    const { origin } = window.location;

    const href = buildUrl(spotifyAccountsUrl, {
        path: 'authorize',
        queryParams: {
            response_type: responseType,
            client_id: clientId,
            scope,
            redirect_uri: `${origin}`,
            state: JSON.stringify({ redirect_uri: window.location.href }),
        },
    });

    window.location.href = href;
}

export function getAccessToken() {
    const spotifyAuth = localStorage.getItem(localStorageKey);

    if (spotifyAuth != null) {
        return JSON.parse(spotifyAuth);
    }

    return undefined;
}

export function setAccessToken(tokenType: string, accessToken: string) {
    localStorage.setItem(
        localStorageKey,
        JSON.stringify({
            tokenType,
            accessToken,
        })
    );
}
