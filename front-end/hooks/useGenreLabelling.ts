"use client";

import { useState } from "react";

import { fetchGenres, fetchLabelItems, labelArtist, labelSong } from "@/services/genre-labelling";
import type { ArtistForLabelling, Genre, Genres, SongForLabelling } from "@heat/types";
import useSWR from "swr";

export type LabelItem =
	| { type: "song"; data: SongForLabelling }
	| { type: "artist"; data: ArtistForLabelling };

export function useGenreLabelling() {
	const { data, error, isLoading } = useSWR("genre-labelling-session", fetchLabellingSession, {
		revalidateOnFocus: false,
		fallbackData: { items: [], genres: {} },
	});
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedSubGenres, setSelectedSubGenres] = useState<Genre[]>([]);
	const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);
	const currentItem = data.items[currentIndex] ?? null;
	const isComplete = !isLoading && currentIndex >= data.items.length;

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

	function next() {
		setCurrentIndex((i) => i + 1);
		setSelectedSubGenres([]);
		setExpandedGenre(null);
	}

	function reset() {
		setFailedAttempts(0);
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

	return {
		items: data.items,
		genres: data.genres,
		currentItem,
		currentIndex,
		selectedSubGenres,
		expandedGenre,
		submitting,
		failedAttempts,
		loading: isLoading,
		error: error ? "Failed to load labelling session." : null,
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

async function fetchLabellingSession(): Promise<{ items: LabelItem[]; genres: Genres }> {
	const [labelItems, genreData] = await Promise.all([fetchLabelItems(), fetchGenres()]);
	const songs: LabelItem[] = labelItems.songs.map((song) => ({ type: "song", data: song }));
	const artists: LabelItem[] = labelItems.artists.map((artist) => ({ type: "artist", data: artist }));
	const items = songs.length === 0 && artists.length === 0 ? [] : [...songs, ...artists];
	const genres = genreData ?? {};
	return { items, genres };
}
