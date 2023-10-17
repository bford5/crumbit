// pull dynamic routes from crumbit.com/c/[...crumbbasket] and populate content
// need to check the slug against known communities, if no community then redirect to index

import CrumbFeed from "@/components/crumbbasket/CrumbFeed";
import MiniCreatePost from "@/components/crumbbasket/MiniCreatePost";
// import { buttonVariants } from "@/components/ui/Button";
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
// import Link from "next/link";
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
				orderBy: {
					createdAt: "desc",
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
				<CrumbFeed
					initialPosts={existingCrumbbasket.posts}
					crumbbasketName={existingCrumbbasket.name}
				/>
			</div>
		</>
	);
};

export default page;
