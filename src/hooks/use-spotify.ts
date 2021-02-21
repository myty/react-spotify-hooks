import axios from 'axios';
import { useContext, useCallback, useMemo } from 'react';
import { authenticate } from '../spotify/authenticate';
import { SpotifyContext } from '../context/spotify-context-provider';
import useToken from './use-token';

const SPOTIFY_BASE_API_URI = 'https://api.spotify.com/v1';

export function useSpotify() {
    const { clientId, onError, scope } = useContext(SpotifyContext);
    const { accessToken, tokenType } = useToken();

    const spotifyApi = useMemo(
        () =>
            axios.create({
                baseURL: SPOTIFY_BASE_API_URI,
                headers: { Authorization: `${tokenType} ${accessToken}` },
                validateStatus: status => status < 500,
            }),
        [accessToken, tokenType]
    );

    const api = useCallback(
        async <T = any>(fetchUrl: string): Promise<T | null | undefined> => {
            try {
                if (accessToken == null || tokenType == null) {
                    authenticate(clientId, scope);
                    return;
                }

                const response = await spotifyApi.get<T>(fetchUrl);

                if (401 === response.status) {
                    authenticate(clientId, scope);
                    return;
                }

                return response.data;
            } catch (error) {
                onError(error);
            }

            return null;
        },
        [accessToken, clientId, onError, scope, spotifyApi, tokenType]
    );

    return {
        api,
        clientId,
        onError,
        scope,
    };
}
