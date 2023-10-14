import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CrumbbasketSubscriptionValidator } from "@/lib/validators/crumbbasket";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const body = await req.json();

		const { crumbbasketId } = CrumbbasketSubscriptionValidator.parse(body);

		const subscriptionExists = await db.subscription.findFirst({
			where: {
				crumbbasketId,
				userId: session.user.id,
			},
		});

		if (subscriptionExists) {
			return new Response("already subscribed to this crumbbasket", {
				status: 400,
			});
		}

		await db.subscription.create({
			data: {
				crumbbasketId,
				userId: session.user.id,
			},
		});

		return new Response(crumbbasketId);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid request data passed", { status: 422 });
		}

		return new Response(
			"could not subscribe to crumbbasket, encountered error",
			{
				status: 500,
			}
		);
	}
}
