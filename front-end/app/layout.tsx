import type { Metadata } from "next";

import Footer from "@/components/footer/Footer";
import { SessionProvider } from "@/context/SessionContext";

import "./globals.css";

export const metadata: Metadata = {
	title: "Heat",
	description: "A music recommendation system built around a genre-guessing game.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`h-full antialiased`}>
			<body className="min-h-full flex flex-col bg-black">
				<SessionProvider>
					<main className="flex-1">{children}</main>
				</SessionProvider>
				<Footer />
			</body>
		</html>
	);
}
