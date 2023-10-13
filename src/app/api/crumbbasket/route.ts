import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CrumbbasketValidator } from "@/lib/validators/crumbbasket";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const body = await req.json();

		const { name } = CrumbbasketValidator.parse(body);

		const crumbbasketExists = await db.crumbbasket.findFirst({
			where: {
				name: name,
			},
		});

		if (crumbbasketExists) {
			return new Response("crumbbasket already exists", { status: 409 });
		}

		const crumbbasketCreated = await db.crumbbasket.create({
			data: {
				name,
				creatorId: session.user.id,
			},
		});
		await db.subscription.create({
			data: {
				userId: session.user.id,
				crumbbasketId: crumbbasketCreated.id,
			},
		});

		return new Response(crumbbasketCreated.name);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response("crumbbasket not created, encountered error", {
			status: 500,
		});
	}
}
