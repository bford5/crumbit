import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { crumbValidator } from "@/lib/validators/crumb";
import { CrumbbasketSubscriptionValidator } from "@/lib/validators/crumbbasket";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const body = await req.json();

		const { crumbbasketId, title, content } = crumbValidator.parse(body);

		const subscriptionExists = await db.subscription.findFirst({
			where: {
				crumbbasketId,
				userId: session.user.id,
			},
		});

		if (!subscriptionExists) {
			return new Response("subscribe to post", {
				status: 400,
			});
		}

		await db.post.create({
			data: {
				crumbbasketId,
				title,
				content,
				authorId: session.user.id,
			},
		});

		return new Response("OK");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid request data passed", { status: 422 });
		}

		return new Response(
			"encountered error, could not drop crumb into crumbbasket",
			{
				status: 500,
			}
		);
	}
}
