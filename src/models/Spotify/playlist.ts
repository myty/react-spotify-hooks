import {
    SpotifyExternalUrls,
    SpotifyImage,
    SpotifyUser,
    SpotifyPaging,
} from './core';
import { SpotifyTrackWithMetadata } from './track';

export interface SpotifyPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: SpotifyExternalUrls;
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    owner: SpotifyUser;
    public?: boolean;
    snapshot_id: string;
    tracks?: SpotifyPaging<SpotifyTrackWithMetadata>;
    type: 'playlist';
    uri: string;
}
