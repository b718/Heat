"use client";

import { sameGenre } from "@/hooks/useGenreLabelling";
import { Genre, Genres } from "@heat/types";

interface Props {
	genres: Genres;
	selectedSubGenres: Genre[];
	expandedGenre: string | null;
	handleGenreClick: (genre: string) => void;
	handleSubGenreClick: (subGenre: Genre) => void;
	handleResetSubGenres: () => void;
}
export default function GenreSelector({
	genres,
	selectedSubGenres,
	expandedGenre,
	handleGenreClick,
	handleSubGenreClick,
	handleResetSubGenres,
}: Props) {
	return (
		<div className="flex flex-col gap-2 w-full">
			{Object.entries(genres).map(([genre, { subgenres }]) => (
				<div key={genre}>
					<button
						onClick={() => handleGenreClick(genre)}
						className={`w-full text-left px-4 py-2 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
							expandedGenre === genre
								? "bg-green-500 text-black"
								: "bg-zinc-800 text-white hover:bg-zinc-700"
						}`}
					>
						{genre}
					</button>
					{expandedGenre === genre && (
						<div className="grid grid-cols-2 gap-2 mt-2 ml-2">
							{subgenres.map((subgenre) => (
								<button
									key={subgenre.name}
									onClick={() => handleSubGenreClick({ genre: genre, subgenre: subgenre.name })}
									className={`px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer ${
										selectedSubGenres.some((selectedSubgenre) =>
											sameGenre(selectedSubgenre, { genre: genre, subgenre: subgenre.name }),
										)
											? "bg-green-500 text-black"
											: "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
									}`}
								>
									<div className="font-medium">{subgenre.name}</div>
									<div className="text-xs mt-0.5">e.g. {subgenre.artistExamples.join(", ")}</div>
								</button>
							))}
						</div>
					)}
				</div>
			))}

			<SelectedSubGenres selectedSubGenres={selectedSubGenres} onReset={handleResetSubGenres} />
		</div>
	);
}

function SelectedSubGenres({
	selectedSubGenres,
	onReset,
}: {
	selectedSubGenres: Genre[];
	onReset: () => void;
}) {
	return (
		<div className="mt-4">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm font-medium text-zinc-400">Selected Sub-Genres</span>
				{selectedSubGenres.length > 0 && (
					<button
						onClick={onReset}
						className="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
					>
						Reset all
					</button>
				)}
			</div>
			<div className="grid grid-cols-2 gap-2">
				{selectedSubGenres.map((selectedSubGenre) => (
					<span
						key={selectedSubGenre.subgenre}
						className="rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-black"
					>
						{selectedSubGenre.subgenre}
					</span>
				))}
			</div>
		</div>
	);
}
