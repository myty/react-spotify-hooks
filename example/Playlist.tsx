import * as React from 'react';
import { SpotifyPlaylist } from '../src';

interface PlaylistProps {
    playlist: SpotifyPlaylist;
}

export function Playlist({ playlist }: PlaylistProps) {
    const imageUrl = playlist.images.length > 0 ? playlist.images[0].url : '';

    return (
        <li
            className="flex overflow-hidden mx-4 my-2 text-left bg-gray-100 rounded border border-gray-400"
            key={playlist.id}
        >
            <div className="flex-none w-32 h-32">
                <img
                    className="object-cover w-full h-full rounded-l"
                    src={imageUrl}
                    alt={`${playlist.name} cover`}
                />
            </div>
            <div className="flex-grow m-2">
                <h2 className="h-6 overflow-hidden font-semibold">
                    {playlist.name}
                </h2>
                <h3 className="text-sm">{playlist.tracks?.total} songs</h3>
                <span className="block text-xs">
                    by {playlist.owner?.display_name}
                </span>
            </div>
        </li>
    );
}
