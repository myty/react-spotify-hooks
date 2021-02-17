import { useContext, useCallback } from 'react';
import {
    authenticate,
    getAccessToken,
} from '../context/spotify-authentication';
import { SpotifyContext } from '../context/spotify-context-provider';
import { SpotifyPaging, SpotifyUser } from '../models/Spotify/core';
import { SpotifyPlaylist } from '../models/Spotify/playlist';
import { SpotifyTrackWithMetadata } from '../models/Spotify/track';

const SPOTIFY_BASE_API_URI = 'https://api.spotify.com/v1';

export function useSpotify() {
    const { clientId, onError, scope } = useContext(SpotifyContext);

    const api = useCallback(
        async <T = any>(fetchUrl: string): Promise<T | null> => {
            try {
                const { tokenType, accessToken } = getAccessToken() ?? {};

                if (accessToken == null || tokenType == null) {
                    authenticate(clientId, scope);
                }

                const prependBaseUrl = fetchUrl?.substr(0, 4) !== 'http';

                const formattedUrl = prependBaseUrl
                    ? `${SPOTIFY_BASE_API_URI}/${fetchUrl}`
                    : fetchUrl;

                const response = await fetch(formattedUrl, {
                    headers: {
                        Authorization: `${tokenType} ${accessToken}`,
                    },
                });

                // Check if unauthenticated user
                if (response.status === 401) {
                    authenticate(clientId, scope);
                }

                return response.json();
            } catch (error) {
                onError(error);
            }

            return null;
        },
        [clientId, onError, scope]
    );

    const getCurrentUserPlaylists = useCallback(
        (fetchUrl?: string) =>
            api<SpotifyPaging<SpotifyPlaylist>>(fetchUrl ?? 'me/playlists'),
        [api]
    );

    const getCurrentUserProfile = useCallback(() => api<SpotifyUser>('me'), [
        api,
    ]);

    const getTracklist = useCallback(
        (url: string) => api<SpotifyPaging<SpotifyTrackWithMetadata>>(url),
        [api]
    );

    return {
        api,
        clientId,
        onError,
        scope,
        getCurrentUserPlaylists,
        getCurrentUserProfile,
        getTracklist,
    };
}
