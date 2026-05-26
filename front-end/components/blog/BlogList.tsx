import type { BlogPostMeta } from "@/services/blog";

import BlogCard from "./BlogCard";

interface Props {
	posts: BlogPostMeta[];
}

export default function BlogList({ posts }: Props) {
	if (posts.length === 0) {
		return <p className="text-zinc-400">No posts yet, check back soon :)</p>;
	}

	return (
		<div className="flex flex-col gap-3 w-full">
			{posts.map((post) => (
				<BlogCard key={post.blogId} post={post} />
			))}
		</div>
	);
}
