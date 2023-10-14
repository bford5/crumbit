import Providers from "@/components/Providers";
import Footer from "@/components/cover/Footer";
import Nav from "@/components/cover/Nav";
import { Toaster } from "@/components/ui/toaster";
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
	authModal,
}: {
	children: React.ReactNode;
	authModal: React.ReactNode;
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
				<Providers>
					{/* @ts-expect-error server-component */}
					<Nav />
					{authModal}
					<main className='mx-auto pt-20 max-w-7xl min-h-screen mb-20 scroll-smooth'>
						{children}
					</main>
					<Toaster />
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
