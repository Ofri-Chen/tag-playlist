export type MusicServiceName = 'spotify' | 'youtube';

export interface Track {
    id: string;
    type: MusicServiceName,
    displayName: string;
    artists: string[];
    album: string;
}

export interface TrackWithTags extends Track {
    tags: string[];
}

export interface User {
    id: string;
    displayName: string;
    musicServices: {
        spotify?: SpotifyUserConfiguration;
    }
}

export interface ICacheService<TKey, TValue> {
    setItem(key: TKey, value: TValue): void;
    getItem(key: TKey): TValue;
}

export interface Configuration {
    stringParameters: {
        start: string;
        end: string;
    },
    musicServices: {
        spotify: BasicSpotifyConfiguration;
    }
}

export interface BasicSpotifyConfiguration {
    chunkOptions: any;
    serverPort: number;
}

export interface SpotifyUserConfiguration {
    generateAccessTokenUri: string;
    serverUri: string;
    clientId: string;
    clientSecret: string;
    accessToken: string;
}
