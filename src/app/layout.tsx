import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import { classNameHelper } from "@/lib/utils";
import "@/styles/globals.css";

import { Inter } from "next/font/google";

export const metadata = {
	title: "Crumbit",
	description:
		"A Reddit clone built with Next.js and TypeScript catered to Foodies",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className={classNameHelper(
				"bg-bg-darkMode text-text-darkMode antialiased scroll-smooth",
				inter.className
			)}
		>
			<body className='bg-bg-darkMode text-text-darkMode antialiased min-h-screen pt-4 h-full scroll-smooth'>
				<Nav />
				<main className='container mx-auto pt-20 max-w-7xl min-h-screen scroll-smooth'>
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
