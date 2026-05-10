"use client";

import Link from "next/link";

import { useGenreLabelling } from "@/hooks/useGenreLabelling";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

import ArtistPlayer from "../player/ArtistPlayer";
import SongPlayer from "../player/SongPlayer";
import GenreSelector from "./GenreSelector";

export default function GenreGame({ token }: { token: string }) {
	const {
		playerRef,
		deviceId,
		playerState,
		loading: spotifyPlayerLoading,
		error: spotifyPlayerError,
		pause,
	} = useSpotifyPlayer(token);
	const {
		items,
		genres,
		currentItem,
		currentIndex,
		selectedSubGenres,
		expandedGenre,
		submitting,
		loading: genreLabellingLoading,
		error: genreLabellingError,
		isComplete,
		handleGenreClick,
		handleSubGenreClick,
		handleSubmit,
		handleResetSubGenres,
	} = useGenreLabelling();

	if (genreLabellingLoading || spotifyPlayerLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<p className="text-zinc-400">Loading session...</p>
			</div>
		);
	}

	if (genreLabellingError) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<p className="text-red-400">{genreLabellingError}</p>
			</div>
		);
	}

	if (spotifyPlayerError) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<p className="text-red-400">{genreLabellingError}</p>
			</div>
		);
	}

	if (isComplete || items.length === 0) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
				{items.length !== 0 && <p className="text-2xl font-bold text-green-500">Session complete!</p>}
				<p className="text-zinc-400">
					{items.length === 0
						? "No songs/artists to label for now :)"
						: `You labelled ${items.length} items.`}
				</p>
				<Link
					href="/"
					onClick={() => window.location.reload()}
					className="rounded-full bg-zinc-800 px-6 py-2 text-sm hover:bg-zinc-700 transition-colors"
				>
					Back to home
				</Link>
			</div>
		);
	}

	return (
		<div className="flex min-h-dvh flex-col items-center justify-start bg-black text-white px-4">
			<ProgressBar currentIndex={currentIndex} items={items} />
			{currentItem.type === "song" ? (
				<SongPlayer
					token={token}
					deviceId={deviceId}
					trackId={currentItem.data.id}
					playerRef={playerRef}
					playerState={playerState}
				/>
			) : (
				<ArtistPlayer
					token={token}
					deviceId={deviceId}
					artistId={currentItem.data.id}
					artistName={currentItem.data.name}
					playerRef={playerRef}
					playerState={playerState}
					pausePlayer={pause}
				/>
			)}
			<div className="flex w-full max-w-lg flex-col gap-6">
				<GenreSelector
					genres={genres}
					selectedSubGenres={selectedSubGenres}
					expandedGenre={expandedGenre}
					handleGenreClick={handleGenreClick}
					handleSubGenreClick={handleSubGenreClick}
					handleResetSubGenres={handleResetSubGenres}
				/>
				<button
					onClick={handleSubmit}
					disabled={selectedSubGenres.length === 0 || submitting}
					className="rounded-full bg-green-500 py-3 mb-4 text-sm font-bold text-black hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{submitting ? "Saving..." : "Save Label"}
				</button>
			</div>
		</div>
	);
}

function ProgressBar({ currentIndex, items }: { currentIndex: number; items: any[] }) {
	return (
		<div className="flex flex-col gap-1 w-full mt-4">
			<div className="w-full h-1 bg-zinc-800 rounded-full">
				<div
					className="h-1 bg-green-500 rounded-full transition-all"
					style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
				/>
			</div>
		</div>
	);
}
