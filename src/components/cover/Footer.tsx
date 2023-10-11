// import { FC } from "react";

// import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/Icons";

const Footer = () => {
	return (
		<footer className='absolute bottom-0 inset-x-0 h-fit z-[10] py-6 border-t-dm-accent border-t-2 bg-bg-darkMode'>
			<div className='container max-w-7xl h-full mx-auto flex flex-row justify-between items-center gap-2'>
				<nav className='flex flex-row gap-2'>
					<Link href='/'>Home</Link>
					<Link href='/about'>About</Link>
					<Link href='/link'>Link</Link>
				</nav>
				<div>
					<Link href='/' className='flex gap-2 items-center'>
						<Icons.cookie className='h-8 w-8 sm:h-6 sm:w-6' />
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
