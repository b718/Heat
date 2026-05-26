import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogPostView from "@/components/blog/BlogPostView";
import { getPostByBlogId } from "@/services/blog";

interface Params {
	params: Promise<{ blogId: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { blogId } = await params;
	const post = await getPostByBlogId(blogId);
	if (!post) return { title: "Post not found — Heat" };

	return {
		title: post.meta.title,
		description: post.meta.description,
	};
}

export default async function BlogPostPage({ params }: Params) {
	const { blogId } = await params;
	const post = await getPostByBlogId(blogId);
	if (!post) {
		notFound();
	}

	return (
		<div className="flex min-h-dvh flex-col items-center bg-black text-white px-4">
			<BlogPostView post={post} />
		</div>
	);
}
