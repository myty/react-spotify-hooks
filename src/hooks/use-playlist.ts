import { useCallback, useEffect, useReducer } from 'react';
import { SpotifyPaging } from '../models/Spotify/core';
import { SpotifyPlaylist } from '../models/Spotify/playlist';
import { SpotifyTrackWithMetadata } from '../models/Spotify/track';
import { useSpotify } from './use-spotify';

interface UsePlaylistOptions {
    id: string;
}

type Playlist = Omit<SpotifyPlaylist, 'tracks'> & {
    tracks: SpotifyTrackWithMetadata[];
    totalTracks: number;
};

type UsePlaylistState = {
    error?: any;
    hasMoreTracks: boolean;
    loading: boolean;
    nextTracksUrl: string | null;
    playlist?: Playlist;
};

enum UsePlaylistActionTypes {
    ADD_TRACKS = 'ADD_TRACKS',
    HAS_ERRORS = 'HAS_ERRORS',
    INITIAL_LOAD = 'INITIAL_LOAD',
    LOADING = 'LOADING',
}

type UsePlaylistActions =
    | {
          type: UsePlaylistActionTypes.ADD_TRACKS;
          tracklist: SpotifyPaging<SpotifyTrackWithMetadata>;
      }
    | { type: UsePlaylistActionTypes.HAS_ERRORS; error: any }
    | { type: UsePlaylistActionTypes.INITIAL_LOAD; playlist: SpotifyPlaylist }
    | { type: UsePlaylistActionTypes.LOADING };

function processState(state: UsePlaylistState): UsePlaylistState {
    const hasMoreTracks = state.nextTracksUrl != null;

    return {
        ...state,
        hasMoreTracks,
    };
}

function addTracklistToPlaylist(
    playlist?: Playlist,
    tracklist?: SpotifyPaging<SpotifyTrackWithMetadata>
): Playlist | undefined {
    if (playlist == null || tracklist == null) {
        return playlist;
    }

    return {
        ...playlist,
        tracks: [...playlist.tracks, ...tracklist.items],
    };
}

function usePlaylistReducer(
    state: UsePlaylistState,
    action: UsePlaylistActions
): UsePlaylistState {
    switch (action.type) {
        case UsePlaylistActionTypes.ADD_TRACKS:
            return processState({
                ...state,
                error: null,
                loading: false,
                nextTracksUrl: action.tracklist.next,
                playlist: addTracklistToPlaylist(
                    state.playlist,
                    action.tracklist
                ),
            });
        case UsePlaylistActionTypes.HAS_ERRORS:
            return processState({
                ...state,
                loading: false,
                error: action.error,
            });
        case UsePlaylistActionTypes.INITIAL_LOAD:
            return processState({
                ...state,
                loading: false,
                error: null,
                nextTracksUrl: action.playlist.tracks?.next ?? null,
                playlist: {
                    ...action.playlist,
                    tracks: action.playlist.tracks?.items ?? [],
                    totalTracks: action.playlist.tracks?.total ?? 0,
                },
            });
        case UsePlaylistActionTypes.LOADING:
            return processState({ ...state, loading: true, error: null });
        default:
            throw new Error();
    }
}

const initialState: UsePlaylistState = {
    hasMoreTracks: false,
    loading: true,
    nextTracksUrl: null,
};

export function usePlaylist({ id }: UsePlaylistOptions) {
    const { api } = useSpotify();

    const [state, dispatch] = useReducer(usePlaylistReducer, initialState);
    const { error, hasMoreTracks, nextTracksUrl, loading, playlist } = state;

    const loadData = useCallback(async () => {
        dispatch({ type: UsePlaylistActionTypes.LOADING });

        try {
            const playlistResult = await api<SpotifyPlaylist>(
                `playlists/${id}`
            );

            if (playlistResult != null) {
                dispatch({
                    type: UsePlaylistActionTypes.INITIAL_LOAD,
                    playlist: playlistResult,
                });
            } else {
                dispatch({
                    type: UsePlaylistActionTypes.HAS_ERRORS,
                    error: 'Playlist Not Found',
                });
            }
        } catch (err) {
            dispatch({ type: UsePlaylistActionTypes.HAS_ERRORS, error: err });
        }
    }, [id, api]);

    const loadMore = async () => {
        if (!hasMoreTracks || loading || nextTracksUrl == null) {
            return;
        }

        dispatch({ type: UsePlaylistActionTypes.LOADING });

        try {
            const tracklist = await api<
                SpotifyPaging<SpotifyTrackWithMetadata>
            >(nextTracksUrl);

            if (tracklist != null) {
                dispatch({
                    type: UsePlaylistActionTypes.ADD_TRACKS,
                    tracklist,
                });
            }
        } catch (err) {
            dispatch({ type: UsePlaylistActionTypes.HAS_ERRORS, error: err });
        }
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        playlist,
        error,
        hasMoreTracks,
        loading,
        loadMoreTracks: () => {
            loadMore();
        },
        loadMoreTracksAsync: loadMore,
        refresh: () => {
            loadData();
        },
    };
}
