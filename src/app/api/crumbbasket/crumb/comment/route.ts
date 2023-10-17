import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const body = await req.json();

		const {
			commentContent,
			crumbId: postId,
			replyToId,
		} = CommentValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		await db.comment.create({
			data: {
				commentContent,
				postId,
				authorId: session.user.id,
				replyToId,
				userId: session.user.id,
			},
		});

		return new Response("ok");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid request data passed", { status: 422 });
		}

		return new Response("encountered error, could not create comment", {
			status: 500,
		});
	}
}
