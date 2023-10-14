// pull dynamic routes from crumbit.com/c/[...crumbbasket] and populate content
// need to check the slug against known communities, if no community then redirect to index

import MiniCreatePost from "@/components/crumbbasket/MiniCreatePost";
import { buttonVariants } from "@/components/ui/Button";
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		pageSlug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { pageSlug } = params;

	const session = await getAuthSession();

	const existingCrumbbasket = await db.crumbbasket.findFirst({
		where: {
			name: pageSlug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
					comments: true,
					crumbbasket: true,
				},
				take: INFINIT_SCROLLING_PAGINATION_RESULTS,
			},
		},
	});

	if (!existingCrumbbasket) return notFound();

	return (
		<>
			<div className='flex flex-col justify-center items-center gap-2'>
				<h1 className='font-bold text-2xl md:text-3xl h-14'>
					welcome to c/{existingCrumbbasket.name}
				</h1>
				<MiniCreatePost session={session} />
				{/* TODO: return posts in user feed BELOW */}
			</div>
		</>
	);
};

export default page;

// keeping the below for learning, replaced it with
// if (!existingCrumbbasket) return notFound();
// -- --
// using !!! before constName turns constName into a boolean AND looks for the opposite of that converted value
// !constName => if value exists->boolean=TRUE, else->boolean=FALSE
// !!constName => if boolean=TRUE -> execute
// !!!constName => if boolean=FALSE -> execute
// ^^ - I was wrong on the above existingCrumbbasket returns a value that can be !-checked, no need to convert
// 	  - was crossing streams thinking i needed to type convert
// if (!!!existingCrumbbasket) {
// 	console.log(`INCORRECT COMMUNITY ${pageSlug}`);
// 	return (
// 		<section className='container max-w-2xl mx-auto pt-20'>
// 			<div>
// 				<h2>INCORRECT CRUMBBASKET</h2>
// 				<Link
// 					href={"/"}
// 					className={`mt-2 ${buttonVariants({ variant: "default" })}`}
// 				>
// 					return home
// 				</Link>
// 			</div>
// 		</section>
// 	);
// }
