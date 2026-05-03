"use client";

import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { skip } from "@/services/music-player";

export default function MusicPlayer({ token }: { token: string }) {
	const { playerRef, playerState, loading, error } = useSpotifyPlayer(token);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black text-white">
				<p className="text-zinc-400">Connecting to Spotify...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black text-white">
				<p className="text-red-400">{error}</p>
			</div>
		);
	}

	if (!playerState) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black text-white">
				<p className="text-zinc-400">Open Spotify and transfer playback to '{"Heat (Playback)"}'</p>
			</div>
		);
	}

	const currentTrack = playerState.track_window.current_track;

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black text-white">
			<img
				src={currentTrack.album.images.at(0)?.url}
				alt={currentTrack.name}
				width={240}
				height={240}
				className="rounded-lg shadow-2xl"
			/>
			<div className="text-center">
				<p className="text-xl font-semibold">{currentTrack.name}</p>
				<p className="text-zinc-400">{currentTrack.artists.map((a) => a.name).join(", ")}</p>
			</div>
			<div className="flex items-center gap-8">
				<button
					onClick={async () => {
						await playerRef.current?.previousTrack();
						await skip("backwards");
					}}
					className="rounded-full bg-zinc-800 px-6 py-3 text-lg font-bold hover:bg-zinc-700 transition-colors"
				>
					{"<<"}
				</button>
				<button
					onClick={() => playerRef.current?.togglePlay()}
					className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold hover:bg-green-400 transition-colors"
				>
					{playerState.paused ? "▶" : "⏸"}
				</button>
				<button
					onClick={async () => {
						await playerRef.current?.nextTrack();
						await skip("forwards");
					}}
					className="rounded-full bg-zinc-800 px-6 py-3 text-lg font-bold hover:bg-zinc-700 transition-colors"
				>
					{">>"}
				</button>
			</div>
		</div>
	);
}
