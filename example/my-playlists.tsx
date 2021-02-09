import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSpotify } from '../src/hooks';
import { SpotifyPlaylist } from '../src/models/Spotify/playlist';

export default function MyPlaylists() {
    const { getCurrentUserPlaylists } = useSpotify();

    const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

    useEffect(() => {
        async function getPlaylists() {
            const playlistsResult = await getCurrentUserPlaylists();
            setPlaylists(prev => [...prev, ...(playlistsResult?.items ?? [])]);
        }

        getPlaylists();
    }, []);

    return (
        <>
            <h1>My Playlists</h1>
            <ul>
                {playlists.map(playlist => (
                    <li>{playlist.name}</li>
                ))}
            </ul>
        </>
    );
}
