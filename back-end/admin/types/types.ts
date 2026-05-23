export type Artist = {
	id: string;
	name: string;
};

export type SongListItem = {
	id: string;
	name: string;
	genres: string[];
	artists: Artist[];
	labelCount: number;
};

export type SongDetail = {
	id: string;
	name: string;
	genres: string[];
	artists: Artist[];
	predictedLabels: { genre: string; count: number }[];
	labels: { id: string; labelledGenres: string[]; createdAt: string }[];
};

export type UpdateSongGenresRequest = {
	genres: string[];
};
