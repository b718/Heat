export interface AccessToken {
	access_token?: string;
}

export type Directon = "forwards" | "backwards";

export interface SkipRequest {
	direction: Directon;
	songId: string;
	songName: string;
	songArtists: { name: string }[];
	currentTime: number;
	duration: number;
}

export interface Song {
	id: string;
	name: string;
	genres: string[];
	artists: string[];
}

export interface Artist {
	id: string;
	name: string;
	genres: string[];
	relatedArtists: string[];
}
