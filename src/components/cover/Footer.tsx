// import { FC } from "react";

// import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/Icons";

const Footer = () => {
	return (
		<footer className='fixed bottom-0 inset-x-0 h-fit z-[10] py-6 border-t-dm-accent border-t-2 bg-bg-darkMode mt-10'>
			<div className='container max-w-7xl h-full mx-auto flex flex-row justify-between items-center gap-2'>
				<nav className='flex flex-row gap-2'>
					<Link href='/'>home</Link>
				</nav>
				<div>
					<Link href='/' className='flex gap-2 items-center'>
						<Icons.cookie className='h-8 w-8 sm:h-6 sm:w-6' />
						crumbit
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
