import genresData from "../../data/genres/genres.json";

export const GENRE_OPTIONS = Object.entries(genresData).flatMap(([genre, data]) => [
	genre,
	...data.subgenres.map((s) => s.name.toLowerCase()),
]);
