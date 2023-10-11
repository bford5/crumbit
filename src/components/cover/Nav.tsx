// import { FC } from "react";

// import Image from "next/image";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "@/components/UserAccountNav";

const Nav = async () => {
	const session = await getAuthSession();

	return (
		<header className='fixed top-0 inset-x-0 h-fit z-[10] py-6 border-b-dm-accent border-b-2 bg-bg-darkMode'>
			<div className='container max-w-7xl h-full mx-auto flex flex-row justify-between items-center gap-2'>
				<div>
					<Link href='/' className='flex gap-2 items-center'>
						<Icons.cookie className='h-8 w-8 sm:h-6 sm:w-6' />
						<p className='hidden text-sm font-medium md:block'>crumbit</p>
					</Link>
				</div>
				<div className='Search'>{/* SEARCH COMPONENT */}</div>
				<nav className='flex flex-row gap-3 items-center'>
					<Link href='/'>home</Link>
					<Link href='/about'>about</Link>
					{!session?.user && (
						<Link
							href='/login'
							className={buttonVariants({ variant: "default" })}
						>
							Login
						</Link>
					)}
					{session?.user && (
						// <Link
						// 	href='/login'
						// 	className={buttonVariants({ variant: "default" })}
						// >
						// 	Logout
						// </Link>
						<UserAccountNav user={session.user} />
					)}
				</nav>
			</div>
		</header>
	);
};

export default Nav;

/* 

header parent element:
    fixed top inset-x-0 h-fit z-[10] py-2

nested div:
    container max-w-7xl h-full mx-auto flex items-center justify-between gap-2




*/
