"use client";

import { useEffect, useState } from "react";

import { fetchGenres, fetchLabelItems, labelArtist, labelSong } from "@/services/genre-labelling";
import type { ArtistForLabelling, Genre, Genres, SongForLabelling } from "@heat/types";

type LabelItem = { type: "song"; data: SongForLabelling } | { type: "artist"; data: ArtistForLabelling };

export function useGenreLabelling() {
	const [items, setItems] = useState<LabelItem[]>([]);
	const [genres, setGenres] = useState<Genres>({});
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedSubGenres, setSelectedSubGenres] = useState<Genre[]>([]);
	const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		Promise.all([fetchLabelItems(), fetchGenres()])
			.then(([labelItems, genreData]) => {
				const songs: LabelItem[] = labelItems.songs.map((song) => ({ type: "song", data: song }));
				const artists: LabelItem[] = labelItems.artists.map((artist) => ({
					type: "artist",
					data: artist,
				}));
				setItems([...songs, ...artists]);
				setGenres(genreData);
			})
			.catch(() => setError("Failed to load labelling session."))
			.finally(() => setLoading(false));
	}, []);

	const currentItem = items[currentIndex] ?? null;
	const isComplete = !loading && currentIndex >= items.length;

	function handleGenreClick(genre: string) {
		setExpandedGenre((prev) => (prev === genre ? null : genre));
	}

	function handleSubGenreClick(subGenre: Genre) {
		setSelectedSubGenres((prev) => {
			const alreadySelected = prev.some((g) => sameGenre(g, subGenre));
			if (alreadySelected) return prev.filter((g) => !sameGenre(g, subGenre));
			return [...prev, subGenre];
		});
	}

	function handleResetSubGenres() {
		setSelectedSubGenres([]);
	}

	async function submit() {
		if (!currentItem || selectedSubGenres.length === 0 || submitting) return;
		setSubmitting(true);
		try {
			if (currentItem.type === "song") {
				await labelSong({
					songId: currentItem.data.id,
					songName: currentItem.data.name,
					genres: selectedSubGenres,
				});
			} else {
				await labelArtist({
					artistId: currentItem.data.id,
					artistName: currentItem.data.name,
					genres: selectedSubGenres,
				});
			}
			setFailedAttempts(0);
		} catch (err) {
			setFailedAttempts((n) => n + 1);
			throw err;
		} finally {
			setSubmitting(false);
		}
	}

	function next() {
		setCurrentIndex((i) => i + 1);
		setSelectedSubGenres([]);
		setExpandedGenre(null);
	}

	function reset() {
		setFailedAttempts(0);
	}

	return {
		items,
		genres,
		currentItem,
		currentIndex,
		selectedSubGenres,
		expandedGenre,
		submitting,
		failedAttempts,
		loading,
		error,
		isComplete,
		submit,
		next,
		reset,
		handleGenreClick,
		handleSubGenreClick,
		handleResetSubGenres,
	};
}

export function sameGenre(genreOne: Genre, genreTwo: Genre) {
	return genreOne.genre === genreTwo.genre && genreOne.subgenre === genreTwo.subgenre;
}
