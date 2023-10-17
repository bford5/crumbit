import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CrumbCommentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const body = await req.json();

		const { crumbCommentId: commentId, voteType } =
			CrumbCommentVoteValidator.parse(body);

		const session = await getAuthSession();
		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const existingVote = await db.commentVote.findFirst({
			where: {
				commentId,
				userId: session.user.id,
			},
		});

		if (existingVote) {
			if (existingVote.type === voteType) {
				await db.commentVote.delete({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
				});
				return new Response("ok");
			} else {
				await db.commentVote.update({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
					data: {
						type: voteType,
					},
				});
				return new Response("ok");
			}
		}

		// ---
		await db.commentVote.create({
			data: {
				commentId,
				type: voteType,
				userId: session.user.id,
			},
		});
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
