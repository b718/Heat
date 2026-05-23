import type { SongDetail, SongListItem } from "../types/types";

export interface SongRepository {
	readonly type: string;

	fetchAllSongs(): Promise<SongListItem[]>;
	fetchSongDetail(songId: string): Promise<SongDetail | null>;
	updateSongGenres(songId: string, genres: string[]): Promise<boolean>;
}
