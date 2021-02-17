import { useCallback, useEffect, useMemo, useState } from 'react';
import { SpotifyPaging, SpotifyPlaylist } from '../models/Spotify';
import { useSpotify } from './use-spotify';

export function useMyPlaylists() {
    const { api } = useSpotify();

    const [loading, setLoading] = useState(true);
    const [playlistPages, setPlaylistPagess] = useState<
        SpotifyPaging<SpotifyPlaylist>[]
    >();

    const nextPageUrl = useMemo(() => {
        if (playlistPages == null) {
            return null;
        }

        const lastPage = playlistPages[playlistPages.length - 1];

        return lastPage.next;
    }, [playlistPages]);

    const hasMore = useMemo(() => {
        return nextPageUrl != null;
    }, [nextPageUrl]);

    const playlists: SpotifyPlaylist[] = useMemo(() => {
        return playlistPages?.flatMap(page => page.items) ?? [];
    }, [playlistPages]);

    const loadData = useCallback(
        async (fetchUrl: string = 'me/playlists') => {
            setLoading(true);
            const pageResult = await api<SpotifyPaging<SpotifyPlaylist>>(
                fetchUrl
            );

            if (pageResult != null) {
                setPlaylistPagess(prev => {
                    if (prev == null || pageResult.previous == null) {
                        return [pageResult];
                    }

                    return [...(prev ?? []), pageResult];
                });
            }
            setLoading(false);
        },
        [api]
    );

    const loadMore = useCallback(() => {
        if (nextPageUrl == null) {
            return;
        }

        loadData(nextPageUrl);
    }, [loadData, nextPageUrl]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        playlists,
        hasMore,
        loading,
        refresh: () => {
            loadData();
        },
        loadMore,
    };
}
