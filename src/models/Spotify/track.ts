import { SpotifyExternalUrls, SpotifyExternalIds, SpotifyUser } from './core';
import { SpotifyAlbum } from './album';
import { SpotifyArtist } from './artist';

export interface SpotifyTrackWithMetadata {
    added_at: string;
    added_by: SpotifyUser;
    is_local: boolean;
    track: SpotifyTrack;
    primary_color?: string;
    video_thumbnail?: { url: string };
}

export interface SpotifyTrackLink {
    external_urls: SpotifyExternalUrls;
    href: string | null;
    id: string | null;
    type: 'track';
    uri: string | null;
}

export interface SpotifyTrack extends SpotifyTrackLink {
    album: SpotifyAlbum | null;
    artists: SpotifyArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: SpotifyExternalIds;
    is_playable: boolean;
    linked_from: SpotifyTrackLink | null;
    restrictions: { reason: string };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    is_local: boolean;
}
