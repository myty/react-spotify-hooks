export interface SpotifyPaging<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string;
    total: number;
}

export interface SpotifyExternalUrls {
    spotify?: string;
}

export interface SpotifyExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
}

export interface SpotifyImage {
    height?: number;
    url: string;
    width?: number;
}

export enum SpotifyProductType {
    Premium = 'premium',
    Free = 'free',
    Open = 'open',
}

export interface SpotifyUser {
    display_name: string;
    external_urls: SpotifyExternalUrls;
    followers: SpotifyReference;
    href: string;
    id?: string;
    images: SpotifyImage[];
    product: SpotifyProductType;
    type: string;
    uri: string;
}

export interface SpotifyReference {
    href: string;
    total: number;
}
