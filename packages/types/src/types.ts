export interface AccessToken {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}

export type Direction = "forwards" | "backwards";

export interface SkipRequest {
	direction: Direction;
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
	direction: Direction;
	currentTime: number;
	duration: number;
	relatedSongId: string;
};

export type Genres = Record<string, { subgenres: Array<{ name: string; artistExamples: string[] }> }>;

export interface SongForLabelling {
	id: string;
	name: string;
}

export interface ArtistForLabelling {
	id: string;
	name: string;
}

export interface UnlabelledItemsResponse {
	songs: SongForLabelling[];
	artists: ArtistForLabelling[];
}

export interface LabelSongRequest {
	songId: string;
	songName: string;
	genres: Genre[];
}

export interface LabelArtistRequest {
	artistId: string;
	artistName: string;
	genres: Genre[];
}

export interface Genre {
	genre: string;
	subgenre: string;
}

export interface GetArtistResponse {
	name: string;
	images: { url: string }[];
}

export interface ArtistQueryResponse {
	tracks: { items: { id: string }[] };
}
