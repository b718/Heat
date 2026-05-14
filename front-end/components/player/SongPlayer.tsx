"use client";

import { RefObject, useState } from "react";

import { LabelItem } from "@/hooks/useGenreLabelling";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";
import type { SpotifyPlayer, SpotifyPlayerState, SpotifyTrack } from "@/types/spotify-sdk";

import PlayerControls from "./PlayerControls";
import PlayerDuration from "./PlayerDuration";

interface Props {
	deviceId: string | null;
	currentItem: LabelItem;
	playerRef: RefObject<SpotifyPlayer | null>;
	playerState: SpotifyPlayerState | null;
	position: number;
	setPosition: (value: number | ((prev: number) => number)) => void;
}

export default function SongPlayer({
	deviceId,
	currentItem,
	playerRef,
	playerState,
	position,
	setPosition,
}: Props) {
	const [volume, setVolume] = useState(0.25);
	const { error, loading } = useSpotifyPlayback({ currentItem, deviceId });

	if (!playerState) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">
					Open Spotify and transfer playback to '{"Heat (Playback)"}'
				</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">Loading song...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-red-400 text-sm text-center">{error ?? "Failed to load song information."}</p>
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
		<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
			<SongArt track={currentTrack} />
			<SongDescription track={currentTrack} />
			<PlayerDuration position={position} durationMs={currentTrack.duration_ms} onSeek={handleSeek} />
			<PlayerControls
				playerState={playerState}
				volume={volume}
				player={playerRef.current}
				position={position}
				onVolumeChange={handleVolumeChange}
			/>
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
