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
