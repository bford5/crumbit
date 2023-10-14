import WYSIWYGEditor from "@/components/crumbbasket/WYSIWYGEditor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		pageSlug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { pageSlug } = params;

	const currentCrumbbasket = await db.crumbbasket.findFirst({
		where: {
			name: pageSlug,
		},
	});

	if (!currentCrumbbasket) return notFound();

	return (
		<div className='flex flex-col items-start gap-6'>
			<div className='border-b border-dm-accent pb-5'>
				<div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
					<h2 className='ml-2 mt-2 text-base font-bold leading-6'>
						drop a crumb
					</h2>
					<p className='ml-2 mt-1 truncate text-sm'>in c/{pageSlug}</p>
				</div>
			</div>
			{/* form goes here */}
			<WYSIWYGEditor crumbbasketId={currentCrumbbasket.id} />

			<div className='w-full flex justify-end'>
				<Button
					type='submit'
					className='w-5/6 mx-auto bg-dm-primary text-text-lightMode hover:text-text-darkMode'
					form='crumbbasket-post-form'
				>
					Submit
				</Button>
			</div>
		</div>
	);
};

export default page;
