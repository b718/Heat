import type { Metadata } from "next";

import BlogList from "@/components/blog/BlogList";
import { getAllPosts } from "@/services/blog";

export const metadata: Metadata = {
	title: "Blog — Heat",
	description: "Posts on building Heat, a music recommendation system.",
};

export default async function BlogIndexPage() {
	const posts = await getAllPosts();

	return (
		<div className="flex min-h-dvh flex-col items-center bg-black text-white px-4">
			<div className="w-full max-w-lg flex flex-col gap-6 mt-12 mb-12">
				<header className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold">Blog</h1>
					<p className="text-zinc-400 text-sm">Notes on building Heat.</p>
				</header>
				<BlogList posts={posts} />
			</div>
		</div>
	);
}
