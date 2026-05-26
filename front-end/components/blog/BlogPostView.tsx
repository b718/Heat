import Link from "next/link";

import { type BlogPost, formatBlogDate } from "@/services/blog";

import BlogMarkdown from "./BlogMarkdown";

interface Props {
	post: BlogPost;
}

export default function BlogPostView({ post }: Props) {
	const LeftArrow = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4"
			aria-hidden="true"
		>
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</svg>
	);

	return (
		<article className="w-full max-w-2xl flex flex-col gap-2 mt-8 mb-12">
			<Link href="/blog" className="text-sm text-zinc-500 hover:text-white transition-colors w-fit">
				<div className="flex justify-center items-center">
					<LeftArrow />
					All posts
				</div>
			</Link>
			<header className="mt-4 flex flex-col gap-2">
				<span className="text-sm text-zinc-500">{formatBlogDate(post.meta.date)}</span>
				<h1 className="text-3xl md:text-4xl font-bold text-white">{post.meta.title}</h1>
				<p className="text-zinc-400">{post.meta.description}</p>
			</header>
			<BlogMarkdown content={post.content} />
		</article>
	);
}
