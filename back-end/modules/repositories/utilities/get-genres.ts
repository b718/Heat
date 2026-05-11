import type { Genre } from "@heat/types";

export default function getGenres(genres: Genre[]): string[] {
	const seenGenres = new Set<string>();
	genres.forEach((genre) => {
		seenGenres.add(genre.genre.toLocaleLowerCase());
		seenGenres.add(genre.subgenre.toLocaleLowerCase());
	});
	return [...seenGenres.keys()];
}
