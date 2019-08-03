export interface Track {
    id: string;
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
        spotify?: SpotifyConfiguration;
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
        spotify: {
            chunkOptions: any;
            serverPort: number;
        };
    }
}

export interface SpotifyConfiguration {
    generateAccessTokenUri: string;
    serverUri: string;
    clientId: string;
    clientSecret: string;
    accessToken: string;
}
