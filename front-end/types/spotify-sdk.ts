export interface SpotifyTrack {
	id: string;
	name: string;
	artists: { name: string }[];
	album: { images: { url: string }[] };
	duration_ms: number;
}

export interface SpotifyPlayerState {
	paused: boolean;
	position: number;
	track_window: {
		current_track: SpotifyTrack;
		next_tracks: SpotifyTrack[];
		previous_tracks: SpotifyTrack[];
	};
}

export interface SpotifyPlayer {
	connect: () => Promise<boolean>;
	disconnect: () => void;
	togglePlay: () => Promise<void>;
	previousTrack: () => Promise<void>;
	nextTrack: () => Promise<void>;
	seek: (positionMs: number) => Promise<void>;
	setVolume: (volume: number) => Promise<void>;
	addListener: (event: string, callback: (arg: any) => void) => void;
	removeListener: (event: string) => void;
}

// Augments the built-in Window interface so TypeScript knows these properties exist on `window`.
declare global {
	interface Window {
		Spotify: {
			// `new` means Player is a constructor — called as `new window.Spotify.Player(opts)`.
			Player: new (opts: {
				name: string;
				// Spotify calls this with a callback; you invoke that callback with the current token.
				getOAuthToken: (callback: (token: string) => void) => void;
				volume: number;
			}) => SpotifyPlayer;
		};
		// Spotify's SDK calls this function automatically once it finishes loading.
		onSpotifyWebPlaybackSDKReady: () => void;
	}
}
