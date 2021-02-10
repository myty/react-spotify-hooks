import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSpotify } from '../src/hooks';
import { SpotifyPlaylist } from '../src/models/Spotify/playlist';
import { Playlist } from './Playlist';

export default function MyPlaylists() {
    const { getCurrentUserPlaylists } = useSpotify();

    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
    const [nextPlaylistUrl, setNextPlaylistUrl] = useState<string>();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded) {
            return;
        }

        (async function getPlaylists() {
            const playlistsResult = await getCurrentUserPlaylists(
                nextPlaylistUrl
            );

            if (playlistsResult?.next == null) {
                setLoaded(true);
            }

            setPlaylists(prev => [...prev, ...(playlistsResult?.items ?? [])]);
            setNextPlaylistUrl(playlistsResult?.next ?? undefined);
        })();
    }, [nextPlaylistUrl]);

    return (
        <>
            <h1 className="p-4 text-xl font-bold">My Playlists</h1>
            <ul>
                {playlists.map(playlist => (
                    <Playlist playlist={playlist} />
                ))}
            </ul>
        </>
    );
}
