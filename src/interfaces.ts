export interface Song {
    id: string;
    displayName: string;
}

export interface SongWithTags extends Song {
    tags: string[];
}