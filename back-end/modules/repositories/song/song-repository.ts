import type { Genre, SongForLabelling, SongInformation } from "@heat/types";

export interface SongRepository {
	readonly type: string;

	fetchUnlabelledSongs(): Promise<SongForLabelling[]>;

	storeSong(data: SongInformation): Promise<void>;
	storeSongLabels(songId: string, songName: string, genres: Genre[]): Promise<void>;
}
