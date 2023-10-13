import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<section className='pt-4 container'>
			<h1>Home</h1>
			<h2 className='font-bold text-3xl md:text-4xl'>Your crumbit feed</h2>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
				{/* feed */}
				{/* crumbbasket info ;; eg a subreddit */}
				<div className='overflow-hidden h-fit rounded-lg border border-dm-accent order-first md:order-last'>
					<div className='bg-dm-accent px-6 py-4'>
						<p className='font-semibold py-3 flex items-center gap-1.5 text-text-lightMode'>
							<HomeIcon className='w-4 h-4' />
							Home
						</p>
					</div>
					<div className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
						<div className='flex justify-between gap-x-4 py-3'>
							<p className='text-text-darkMode'>
								Your crumbit homepage. Browse your favorite crumbbaskets here!
							</p>
						</div>
						<Link
							href='/c/create'
							className={buttonVariants({
								className: "w-fill mt-4 mb-6",
								variant: "outline",
							})}
						>
							Create crumbbasket
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
