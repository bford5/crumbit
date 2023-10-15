import { INFINIT_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import CrumbFeed from "../crumbbasket/CrumbFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
	const session = await getAuthSession();

	const followedCrumbbaskets = await db.subscription.findMany({
		where: {
			userId: session?.user.id,
		},
		include: {
			crumbbasket: true,
		},
	});

	const crumbs = await db.post.findMany({
		where: {
			crumbbasket: {
				name: {
					in: followedCrumbbaskets.map(({ crumbbasket }) => crumbbasket.id),
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			crumbbasket: true,
		},
		take: INFINIT_SCROLLING_PAGINATION_RESULTS,
	});

	return <CrumbFeed initialPosts={crumbs} />;
};

export default CustomFeed;
