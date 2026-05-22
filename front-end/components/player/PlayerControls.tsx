"use client";

import { buildSkipRequest, skip } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";
import { sliderGradient } from "@/utilities/slider";

interface Props {
	playerState: SpotifyPlayerState;
	volume: number;
	player: SpotifyPlayer | null;
	position: number;
	onVolumeChange: (v: number) => void;
}

export default function PlayerControls({
	playerState,
	volume,
	player,
	position,
	onVolumeChange,
}: Props) {
	const { paused, track_window } = playerState;
	const volumePercentage = volume * 100;
	const currentTrack = track_window.current_track;
	const hasPreviousTracks = track_window.previous_tracks.length > 0;
	const hasNextTracks = track_window.next_tracks.length > 0;

	return (
		<div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
			<div className="flex w-full items-center gap-2">
				<button
					onClick={() => player?.togglePlay()}
					aria-label={paused ? "Play" : "Pause"}
					className="flex flex-1 items-center justify-center rounded-full bg-green-500 py-2 hover:bg-green-400 transition-colors cursor-pointer"
				>
					{paused ? (
						<svg
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							className="h-4 w-4 fill-black"
						>
							<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
						</svg>
					) : (
						<svg
							viewBox="0 0 16 16"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							className="h-4 w-4 fill-black"
						>
							<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
						</svg>
					)}
				</button>
				<button
					disabled={!hasPreviousTracks}
					onClick={async () => {
						await Promise.all([
							player?.previousTrack(),
							skip(buildSkipRequest("backwards", currentTrack, position)),
						]);
					}}
					className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				>
					{"<<"}
				</button>
				<button
					disabled={!hasNextTracks}
					onClick={async () => {
						await Promise.all([
							player?.nextTrack(),
							skip(buildSkipRequest("forwards", currentTrack, position)),
						]);
					}}
					className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
				>
					{">>"}
				</button>
			</div>
			<div className="flex w-full items-center gap-2 sm:w-auto">
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
					className="slider w-full sm:w-24"
					style={{ background: sliderGradient(volumePercentage) }}
				/>
			</div>
		</div>
	);
}
