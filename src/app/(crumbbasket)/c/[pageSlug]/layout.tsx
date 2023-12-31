import SubLeaveToggle from "@/components/crumbbasket/SubLeaveToggle";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

const Layout = async ({
	children,
	params: { pageSlug },
}: {
	children: React.ReactNode;
	params: { pageSlug: string };
}) => {
	const session = await getAuthSession();

	const viewingCrumbbasket = await db.crumbbasket.findFirst({
		where: {
			name: pageSlug,
		},
		include: {
			posts: {
				include: {
					author: true,
					// comments: true,
					votes: true,
					// crumbbasket: true,
				},
			},
		},
	});

	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					crumbbasket: {
						name: pageSlug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });

	const isSubscribed = !!subscription;
	//   ^^ using !! for type conversion to bollean

	if (!viewingCrumbbasket) return notFound();

	const subscriberCount = await db.subscription.count({
		where: {
			crumbbasket: {
				name: pageSlug,
			},
		},
	});
	// ^^ getting the sub count of crumbbaskets where the name of the crumbbasket matches the pageSlug
	// eg: 10 subs on /c/sample in DB returns 10->subscriberCount

	return (
		<section className='sm:container max-w-7xl mx-auto h-full pt-12'>
			<div>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
					<div className='flex flex-col col-span-2 space-y-6'>{children}</div>
					{/* INFOSIDEBAR */}
					<div className='block order-last h-fit rounded-lg border mx-4 md:mx-0 border-dm-accent overflow-hidden'>
						<div className='px-6 py-4'>
							<p className='font-semibold py-3'>
								about c/{viewingCrumbbasket.name}
							</p>
							{viewingCrumbbasket.creatorId === session?.user.id ? (
								<p className='text-center lg:text-left text-[13px]'>
									you own this crumbbasket!
								</p>
							) : null}
						</div>
						<dl className='divide-y divide-dm-accent px-6 py-4 text-sm leading-6 bg-dm-secondary text-text-darkMode'>
							<div className='flex justify-between gap-x-4 py-3'>
								<dt className=''>created on:</dt>
								<dd className=''>
									<time dateTime={viewingCrumbbasket.createdAt.toDateString()}>
										{format(viewingCrumbbasket.createdAt, "d MMM yyyy")}
									</time>
								</dd>
							</div>
							<div className='flex justify-between gap-x-4 py-4'>
								<dt className=''>members:</dt>
								<dd className=''>
									<div className='bg-dm-accent text-text-lightMode py-[0.5px] px-[6.5px] rounded-full'>
										{subscriberCount}
									</div>
								</dd>
							</div>

							{viewingCrumbbasket.creatorId !== session?.user.id ? (
								<div className='notOwnerThenSubscribe flex flex-col justify-center items-center py-2'>
									<SubLeaveToggle
										crumbbasketId={viewingCrumbbasket.id}
										crumbbasketName={viewingCrumbbasket.name}
										isSubscribed={isSubscribed}
									/>
								</div>
							) : null}

							<div className='p-2'>
								<Link
									href={`${pageSlug}/submit`}
									className={buttonVariants({
										variant: "custom1",
										className:
											"w-full bg-bg-darkMode hover:bg-text-lightMode border border-bg-darkMode hover:border-dm-accent transition-all duration-200",
									})}
								>
									drop a crumb!
								</Link>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Layout;
