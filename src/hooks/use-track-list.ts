import { useCallback, useEffect, useMemo, useState } from 'react';
import { SpotifyPaging } from '../models/Spotify/core';
import { SpotifyTrackWithMetadata } from '../models/Spotify/track';
import { useSpotify } from './use-spotify';

export function useTracklist() {
    const { api } = useSpotify();

    const [loading, setLoading] = useState(true);
    const [tracklistPages, setTracklistPagess] = useState<
        SpotifyPaging<SpotifyTrackWithMetadata>[]
    >();

    const nextPageUrl = useMemo(() => {
        if (tracklistPages == null) {
            return null;
        }

        const lastPage = tracklistPages[tracklistPages.length - 1];

        return lastPage.next;
    }, [tracklistPages]);

    const hasMore = useMemo(() => {
        return nextPageUrl != null;
    }, [nextPageUrl]);

    const tracklists: SpotifyTrackWithMetadata[] = useMemo(() => {
        return tracklistPages?.flatMap(page => page.items) ?? [];
    }, [tracklistPages]);

    const loadData = useCallback(
        async (fetchUrl: string = 'me/playlists') => {
            setLoading(true);

            const pageResult = await api<
                SpotifyPaging<SpotifyTrackWithMetadata>
            >(fetchUrl);

            if (pageResult != null) {
                setTracklistPagess(prev => {
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
        tracklists,
        hasMore,
        loading,
        refresh: () => {
            loadData();
        },
        loadMore,
    };
}
