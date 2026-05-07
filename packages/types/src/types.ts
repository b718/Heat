export interface AccessToken {
	access_token?: string;
}

export type Directon = "forwards" | "backwards";

export interface SkipRequest {
	direction: Directon;
	songId: string;
	songName: string;
	songArtists: {
		providerId: string;
		name: string;
	}[];
	currentTime: number;
	duration: number;
	parserType: string;
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

export type ParsedResult = {
	song: SongInformation;
	artists: ArtistInformation[];
	skip: SkipInformation;
};

export type SongInformation = {
	id: string;
	name: string;
	genres: string[];
};

export type ArtistInformation = {
	id: string;
	name: string;
	genres: string[];
	relatedSongId: string;
};

export type SkipInformation = {
	direction: Directon;
	currentTime: number;
	duration: number;
	relatedSongId: string;
};
