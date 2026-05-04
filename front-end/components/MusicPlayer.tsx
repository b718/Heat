"use client";

import { useEffect, useState } from "react";

import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { skip } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyTrack } from "@/types/spotify-sdk";

export default function MusicPlayer({ token }: { token: string }) {
	const { playerRef, playerState, loading, error } = useSpotifyPlayer(token);
	const [volume, setVolume] = useState(0);
	const [position, setPosition] = useState(0);

	useEffect(() => {
		if (!playerState) return;
		setPosition(playerState.position);
		if (playerState.paused) return;
		const interval = setInterval(() => setPosition((prev) => prev + 1000), 1000);
		return () => clearInterval(interval);
	}, [playerState]);

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

	async function handleSeek(ms: number) {
		setPosition(ms);
		await playerRef.current?.seek(ms);
	}

	async function handleVolumeChange(v: number) {
		setVolume(v);
		await playerRef.current?.setVolume(v);
	}

	const currentTrack = playerState.track_window.current_track;

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
			<div className="flex w-2xl flex-col items-center gap-3">
				<SongArt track={currentTrack} />
				<SongDescription track={currentTrack} />
				<SongDuration position={position} durationMs={currentTrack.duration_ms} onSeek={handleSeek} />
				<SongControls
					paused={playerState.paused}
					volume={volume}
					player={playerRef.current}
					onVolumeChange={handleVolumeChange}
				/>
			</div>
		</div>
	);
}

function SongArt({ track }: { track: SpotifyTrack }) {
	return (
		<img
			src={track.album.images.at(0)?.url}
			alt={track.name}
			width={240}
			height={240}
			className="rounded-lg shadow-2xl"
		/>
	);
}

function SongDescription({ track }: { track: SpotifyTrack }) {
	return (
		<div className="w-full text-center">
			<p className="text-xl font-semibold">{track.name}</p>
			<p className="text-sm text-zinc-400">{track.artists.map((a) => a.name).join(", ")}</p>
		</div>
	);
}

function SongDuration({
	position,
	durationMs,
	onSeek,
}: {
	position: number;
	durationMs: number;
	onSeek: (ms: number) => void;
}) {
	const progressPercentage = (position / durationMs) * 100;
	return (
		<div className="flex w-full flex-col gap-1">
			<input
				type="range"
				min={0}
				max={durationMs}
				value={position}
				onChange={(e) => onSeek(parseInt(e.target.value))}
				className="slider w-full"
				style={{ background: getSliderGradient(progressPercentage) }}
			/>
			<div className="flex justify-between text-xs text-zinc-400">
				<span>{formatMs(position)}</span>
				<span>{formatMs(durationMs)}</span>
			</div>
		</div>
	);
}

function SongControls({
	paused,
	volume,
	player,
	onVolumeChange,
}: {
	paused: boolean;
	volume: number;
	player: SpotifyPlayer | null;
	onVolumeChange: (v: number) => void;
}) {
	const volumePercentage = volume * 100;
	return (
		<div className="flex w-xl items-center gap-2">
			<button
				onClick={() => player?.togglePlay()}
				className="flex-1 rounded-full bg-green-500 py-2 text-sm font-bold hover:bg-green-400 transition-colors"
			>
				{paused ? "▶" : "⏸"}
			</button>
			<button
				onClick={async () => {
					await player?.previousTrack();
					await skip("backwards");
				}}
				className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700 transition-colors"
			>
				{"<<"}
			</button>
			<button
				onClick={async () => {
					await player?.nextTrack();
					await skip("forwards");
				}}
				className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-bold hover:bg-zinc-700 transition-colors"
			>
				{">>"}
			</button>
			<svg
				viewBox="0 0 16 16"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				className="h-4 w-4 text-zinc-400 shrink-0"
			>
				<path
					d="M7.14645 1.85356C7.46143 1.53858 8 1.76167 8 2.20712V13.7929C8 14.2384 7.46143 14.4614 7.14645 14.1465L4 11H1.5C1.22386 11 1 10.7762 1 10.5V5.50001C1 5.22387 1.22386 5.00001 1.5 5.00001H4L7.14645 1.85356Z"
					fill="currentColor"
				/>
				<path
					d="M12 7.99999C12 9.48649 10.9189 10.7205 9.5 10.9585V5.04147C10.9189 5.27951 12 6.5135 12 7.99999Z"
					fill="currentColor"
				/>
			</svg>
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={volume}
				onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
				className="slider w-24"
				style={{ background: getSliderGradient(volumePercentage) }}
			/>
		</div>
	);
}

function formatMs(ms: number): string {
	const totalSec = Math.floor(ms / 1000);
	const min = Math.floor(totalSec / 60);
	const sec = (totalSec % 60).toString().padStart(2, "0");
	return `${min}:${sec}`;
}

function getSliderGradient(percentage: number): string {
	return `linear-gradient(to right, #22c55e ${percentage}%, #3f3f46 ${percentage}%)`;
}
