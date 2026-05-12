"use client";

import { RefObject, useEffect, useState } from "react";

import { getArtist, playArtistTopTrack } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";
import { GetArtistResponse } from "@heat/types";

import PlayerControls from "./PlayerControls";
import PlayerDuration from "./PlayerDuration";

interface Props {
	token: string;
	deviceId: string | null;
	artistId: string;
	artistName: string;
	playerRef: RefObject<SpotifyPlayer | null>;
	playerState: SpotifyPlayerState | null;
	pausePlayer: () => void;
	position: number;
	setPosition: (value: number | ((prev: number) => number)) => void;
}

export default function ArtistPlayer({
	token,
	deviceId,
	artistId,
	artistName,
	playerRef,
	playerState,
	pausePlayer,
	position,
	setPosition,
}: Props) {
	const [volume, setVolume] = useState(0.5);
	const [artistInfo, setArtistInfo] = useState<GetArtistResponse | null>(null);
	const [artistLoading, setArtistLoading] = useState(true);
	const [artistError, setArtistError] = useState<string | null>(null);

	useEffect(() => {
		if (!deviceId) return;
		pausePlayer();
		setArtistLoading(true);
		setArtistError(null);

		Promise.all([playArtistTopTrack(deviceId, artistName, token), getArtist(artistId, token)])
			.then(([_, response]) => setArtistInfo(response))
			.catch(() => setArtistError("Failed to load artist."))
			.finally(() => setArtistLoading(false));
	}, [artistId, artistName, token, deviceId]);

	async function handleSeek(ms: number) {
		setPosition(ms);
		await playerRef.current?.seek(ms);
	}

	async function handleVolumeChange(v: number) {
		setVolume(v);
		await playerRef.current?.setVolume(v);
	}

	if (!playerState) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">
					Open Spotify and transfer playback to '{"Heat (Playback)"}'
				</p>
			</div>
		);
	}

	if (artistLoading) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">Loading artist...</p>
			</div>
		);
	}

	if (artistError || !artistInfo) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
				<p className="text-red-400 text-sm text-center">{artistError ?? "Failed to load artist."}</p>
			</div>
		);
	}

	const currentTrack = playerState.track_window.current_track;

	return (
		<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-3xl mt-4">
			<ArtistArt artist={artistInfo} />
			<ArtistDescription artist={artistInfo} />
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

function ArtistArt({ artist }: { artist: GetArtistResponse }) {
	return (
		<img
			src={artist.images.at(0)?.url}
			alt={artist.name}
			width={240}
			height={240}
			className="rounded-lg shadow-2xl"
		/>
	);
}

function ArtistDescription({ artist }: { artist: GetArtistResponse }) {
	return (
		<div className="w-full text-center">
			<p className="text-xl font-semibold">{artist.name}</p>
		</div>
	);
}
