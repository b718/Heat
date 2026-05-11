import type { ArtistForLabelling, ArtistInformation, Genre } from "@heat/types";

export interface ArtistRepository {
	readonly type: string;

	fetchUnlabelledArtists(): Promise<ArtistForLabelling[]>;

	storeArtists(data: ArtistInformation[]): Promise<void>;
	storeArtistLabels(artistId: string, artistName: string, genres: Genre[]): Promise<void>;
}
