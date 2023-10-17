export const metadata = {
	title: "settings",
	description: "manage account settings",
};

import UsernameForm from "@/components/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
	const session = await getAuthSession();

	if (!session?.user) {
		redirect(authOptions.pages?.signIn || "/login");
	}

	return (
		<div className='max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto py-12'>
			<div className='grid items-start gap-8'>
				<h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>
			</div>
			<div className='grid gap-10'>
				<UsernameForm
					user={{
						id: session.user.id,
						username: session.user.username || "",
					}}
				/>
			</div>
		</div>
	);
};

export default page;
