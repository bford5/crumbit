import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("not authorized", { status: 401 });
		}

		const body = await req.json();

		const { name } = UsernameValidator.parse(body);

		const usernameExists = await db.user.findFirst({
			where: {
				username: name,
			},
		});

		if (usernameExists) {
			return new Response("username is taken", { status: 409 });
		}

		// update username
		await db.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				username: name,
			},
		});
		return new Response("ok");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("invalid request data passed", { status: 422 });
		}

		return new Response("could not update username, encountered error", {
			status: 500,
		});
	}
}
