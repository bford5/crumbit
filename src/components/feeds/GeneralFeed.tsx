import { INFINIT_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import CrumbFeed from "../crumbbasket/CrumbFeed";

const GeneralFeed = async () => {
	const crumbs = await db.post.findMany({
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

export default GeneralFeed;
