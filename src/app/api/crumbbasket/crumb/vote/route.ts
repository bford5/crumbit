import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CrumbVoteValidator } from "@/lib/validators/vote";
import { CachedPostPayload } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;
// above is used as param to cache "active posts"
// for dev/testing set to 1
// for live/prod set to 10

export async function PATCH(req: Request) {
	try {
		const body = await req.json();

		const { postId, voteType } = CrumbVoteValidator.parse(body);

		const session = await getAuthSession();
		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const existingVote = await db.vote.findFirst({
			where: {
				userId: session.user.id,
				postId,
			},
		});

		const post = await db.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				author: true,
				votes: true,
			},
		});

		if (!post) {
			return new Response("crumb not found", { status: 404 });
		}

		if (existingVote) {
			if (existingVote.type === voteType) {
				await db.vote.delete({
					where: {
						userId_postId: {
							postId,
							userId: session.user.id,
						},
					},
				});
				return new Response("ok");
			}

			await db.vote.update({
				where: {
					userId_postId: {
						postId,
						userId: session.user.id,
					},
				},
				data: {
					type: voteType,
				},
			});

			// recount votes
			const votesAmount = post.votes.reduce((acc, vote) => {
				if (vote.type === "UP") return acc + 1;
				if (vote.type === "DOWN") return acc - 1;
				return acc;
			}, 0);

			// caching here
			if (votesAmount >= CACHE_AFTER_UPVOTES) {
				const cachePayload: CachedPostPayload = {
					authorUsername: post.author.username ?? "",
					content: JSON.stringify(post.content),
					createdAt: post.createdAt,
					currentVote: voteType,
					id: post.id,
					title: post.title,
				};

				await redis.hset(`post:${postId}`, cachePayload);
			}

			return new Response("ok");
		}

		// ---
		await db.vote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				postId,
			},
		});

		// recount votes
		const votesAmount = post.votes.reduce((acc, vote) => {
			if (vote.type === "UP") return acc + 1;
			if (vote.type === "DOWN") return acc - 1;
			return acc;
		}, 0);

		// caching here
		if (votesAmount >= CACHE_AFTER_UPVOTES) {
			const cachePayload: CachedPostPayload = {
				authorUsername: post.author.username ?? "",
				content: JSON.stringify(post.content),
				createdAt: post.createdAt,
				currentVote: voteType,
				id: post.id,
				title: post.title,
			};
			await redis.hset(`post:${postId}`, cachePayload);
		}
		return new Response("ok");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid request data passed", { status: 422 });
		}

		return new Response("could not register vote request, encountered error", {
			status: 500,
		});
	}
}
