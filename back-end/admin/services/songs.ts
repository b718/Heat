import type { ErrorResponse, SongDetail, SongListItem } from "../types/types";

export async function fetchSongs(): Promise<SongListItem[]> {
	const response = await fetch("/api/songs");
	if (!response.ok) throw new Error(await readError(response));
	return response.json();
}

export async function fetchSongDetail(id: string): Promise<SongDetail> {
	const response = await fetch(`/api/songs/${id}`);
	if (!response.ok) throw new Error(await readError(response));
	return response.json();
}

export async function updateSongGenres(id: string, genres: string[]): Promise<void> {
	const response = await fetch(`/api/songs/${id}/genres`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ genres }),
	});
	if (!response.ok) throw new Error(await readError(response));
}

async function readError(response: Response): Promise<string> {
	const body = (await response.json().catch(() => null)) as ErrorResponse | null;
	return body?.error ?? `HTTP ${response.status}`;
}
