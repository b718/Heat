import Link from "next/link";

import { type BlogPostMeta, formatBlogDate } from "@/services/blog";

interface Props {
	post: BlogPostMeta;
}

export default function BlogCard({ post }: Props) {
	return (
		<Link
			href={`/blog/${post.blogId}`}
			className="flex flex-col gap-1 rounded-lg bg-zinc-800 px-4 py-3 hover:bg-zinc-700 transition-colors"
		>
			<span className="text-xs text-zinc-500">{formatBlogDate(post.date)}</span>
			<span className="font-semibold text-white">{post.title}</span>
			<span className="text-sm text-zinc-400">{post.description}</span>
		</Link>
	);
}
