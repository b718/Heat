"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DO_NOT_SHOW_FOOTER_PATH = "blog";

export default function Footer() {
	const pathname = usePathname();
	if (pathname.includes(DO_NOT_SHOW_FOOTER_PATH)) {
		return <></>;
	}

	return (
		<footer className="border-t border-zinc-900 bg-black">
			<div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-4 text-sm">
				<span className="text-zinc-500">Heat</span>
				<Link
					href="/blog"
					className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
				>
					Blog
				</Link>
			</div>
		</footer>
	);
}
