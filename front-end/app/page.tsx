"use client";

import { useEffect, useState } from "react";

import Player from "@/components/Player";
import { fetchToken, loginUrl } from "@/services/auth";

export default function Home() {
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchToken()
			.then(setToken)
			.catch(() => setError("Failed to load authentication token."))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<p className="text-zinc-400">Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<p className="text-red-400">{error}</p>
			</div>
		);
	}

	if (!token) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<a
					href={loginUrl}
					className="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-black hover:bg-green-400 transition-colors"
				>
					Login with Spotify
				</a>
			</div>
		);
	}

	return <Player token={token} />;
}
