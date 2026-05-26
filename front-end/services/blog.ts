import { cache } from "react";

import matter from "gray-matter";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import "server-only";

export interface BlogPostMeta {
	blogId: string;
	title: string;
	description: string;
	date: string;
}

export interface BlogPost {
	meta: BlogPostMeta;
	content: string;
}

interface Frontmatter {
	title?: string;
	description?: string;
	date?: string;
}

// Authors write images relative to their post folder (e.g. `![x](dip.png)`),
// but the browser fetches from /blog/<blogId>/<file>. This rewrites those
// relative refs to the served path while leaving already-absolute URLs alone.
function rewriteRelativeImagePaths(markdown: string, blogId: string): string {
	const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g;
	return markdown.replace(MARKDOWN_IMAGE, (match, alt, url, title) => {
		// Skip URLs that are already absolute: http://, https://, //cdn..., or /foo.
		if (/^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith("/")) {
			return match;
		}

		return `![${alt}](/blog/${blogId}/${url}${title ?? ""})`;
	});
}

const BLOG_DIR = resolve(process.cwd(), "public/blog");

async function readPostFromDisk(blogId: string): Promise<BlogPost | null> {
	const filePath = join(BLOG_DIR, blogId, "blog-post.md");
	let raw: string;
	try {
		raw = await readFile(filePath, "utf8");
	} catch {
		return null;
	}

	const { data, content } = matter(raw);
	const frontmatter = data as Frontmatter;
	if (!frontmatter.title || !frontmatter.description || !frontmatter.date) {
		return null;
	}

	return {
		meta: {
			blogId,
			title: frontmatter.title,
			description: frontmatter.description,
			date: frontmatter.date,
		},
		content: rewriteRelativeImagePaths(content, blogId),
	};
}

export const getAllPosts = cache(async (): Promise<BlogPostMeta[]> => {
	const entries = await readdir(BLOG_DIR);
	const posts: BlogPostMeta[] = [];
	for (const blogId of entries) {
		const entryStat = await stat(join(BLOG_DIR, blogId));
		if (!entryStat.isDirectory()) {
			continue;
		}

		const post = await readPostFromDisk(blogId);
		if (post) {
			posts.push(post.meta);
		}
	}

	return posts.sort((a, b) => b.date.localeCompare(a.date));
});

export const getPostByBlogId = cache(async (blogId: string): Promise<BlogPost | null> => {
	return readPostFromDisk(blogId);
});

export function formatBlogDate(date: string): string {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return date;
	}

	return parsed.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
