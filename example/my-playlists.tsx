import * as React from 'react';
import { useEffect } from 'react';
import { useMyPlaylists } from '../src';
import { Playlist } from './playlist';

export default function MyPlaylists() {
    const { playlists, loading, hasMore, loadMore } = useMyPlaylists();

    useEffect(() => {
        if (!loading && hasMore) {
            loadMore();
        }
    }, [loading, loadMore, hasMore]);

    return (
        <>
            <h1 className="p-4 text-xl font-bold">My Playlists</h1>
            <ul>
                {playlists.map(playlist => (
                    <Playlist key={playlist.id} playlist={playlist} />
                ))}
            </ul>
        </>
    );
}
