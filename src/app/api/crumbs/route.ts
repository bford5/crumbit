import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
	const url = new URL(req.url);

	const session = await getAuthSession();

	let followedCrumbbasketsIds: string[] = [];

	if (session) {
		const followedCrumbbaskets = await db.subscription.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				crumbbasket: true,
			},
		});

		followedCrumbbasketsIds = followedCrumbbaskets.map(
			({ crumbbasket }) => crumbbasket.id
		);
	}

	try {
		const { limit, page, crumbbasketName } = z
			.object({
				limit: z.string(),
				page: z.string(),
				crumbbasketName: z.string().nullish().optional(),
			})
			.parse({
				crumbbasketName: url.searchParams.get("crumbbasketName"),
				limit: url.searchParams.get("limit"),
				page: url.searchParams.get("page"),
			});

		let whereClause = {};
		if (crumbbasketName) {
			whereClause = {
				crumbbasket: {
					name: crumbbasketName,
				},
			};
		} else if (session) {
			whereClause = {
				crumbbasket: {
					id: {
						in: followedCrumbbasketsIds,
					},
				},
			};
		}

		const posts = await db.post.findMany({
			take: parseInt(limit),
			skip: (parseInt(page) - 1) * parseInt(limit),
			orderBy: {
				createdAt: "desc",
			},
			include: {
				crumbbasket: true,
				votes: true,
				author: true,
				comments: true,
			},
			where: whereClause,
		});

		return new Response(JSON.stringify(posts));
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid data request", { status: 422 });
		}

		return new Response("could not complete request, please try again", {
			status: 500,
		});
	}
}
