"use client";

import GenreGame from "@/components/genre-labelling/GenreGame";
import { useToken } from "@/hooks/useToken";
import { loginUrl } from "@/services/auth";

export default function Home() {
	const { data: token, error, isLoading: loading } = useToken();

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
				<p className="text-red-400">{error.message}</p>
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

	return <GenreGame token={token} />;
}
