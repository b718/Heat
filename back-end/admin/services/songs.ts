import type { SongDetail, SongListItem } from "../types/types";

export async function fetchSongs(): Promise<SongListItem[]> {
	const response = await fetch("/api/songs");
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	return response.json();
}

export async function fetchSongDetail(id: string): Promise<SongDetail> {
	const response = await fetch(`/api/songs/${id}`);
	if (response.status === 404) throw new Error("Song not found");
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	return response.json();
}

export async function updateSongGenres(id: string, genres: string[]): Promise<void> {
	const response = await fetch(`/api/songs/${id}/genres`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ genres }),
	});
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
}
