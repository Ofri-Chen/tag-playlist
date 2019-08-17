export type MusicServiceTypes = 'spotify' | 'youtube';

export interface Track {
    id: string;
    type: MusicServiceTypes,
    displayName: string;
    artists: string[];
    album: string;
}

export interface TrackWithTags extends Track {
    tags: string[];
}

export interface PlaylistMetadata {
    id: string;
    displayName: string;
}

export interface User {
    id: string;
    displayName: string;
    musicServices: {
        spotify?: SpotifyUserConfiguration;
    }
}

export interface ICacheService<TKey, TValue> {
    setItem(key: TKey, value: TValue, expiration?: number): void;
    removeItem(key: TKey): void;
    getItem(key: TKey): TValue;
}

export interface ILogger {
    info(message: string, meta?: any);
    warn(message: string, meta?: any);
    error(message: string, meta?: any);
}

export interface Configuration {
    stringParameters: {
        start: string;
        end: string;
    },
    musicServices?: {
        spotify?: SpotifyConfiguration;
    },
    mongo?: MongoConfig;
}

export interface MongoConfig {
    uri: string;
    dbName: string;
    collection: string;
}

export interface SpotifyConfiguration {
    serverUri: string;
    generateAccessTokenUri: string;
    accessTokenExpiration: number;
    chunkOptions: any;
    serverPort: number;
}

export interface SpotifyUserConfiguration {
    clientId: string;
    clientSecret: string;
    accessToken: string;
}
