import CrumbComments from "@/components/crumbbasket/CrumbComments";
import EditorOutput from "@/components/crumbbasket/EditorOutput";
import CrumbVoteServer from "@/components/crumbbasket/crumb-vote/CrumbVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPostPayload } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface pageProps {
	params: {
		crumbId: string;
	};
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: pageProps) => {
	const cachedPost = (await redis.hgetall(
		`post: ${params.crumbId}`
	)) as CachedPostPayload;

	let post: (Post & { votes: Vote[]; author: User }) | null = null;

	if (!cachedPost) {
		post = await db.post.findFirst({
			where: {
				id: params.crumbId,
			},
			include: {
				votes: true,
				author: true,
			},
		});
	}

	if (!post && !cachedPost) return notFound();

	return (
		<div className='mx-6 md:mx-0'>
			<div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between border-[1.25px] border-dm-primary rounded-md'>
				<Suspense fallback={<CrumbVoteShell />}>
					{/* @ts-expect-error server component async */}
					<CrumbVoteServer
						crumbId={post?.id ?? cachedPost.id}
						getData={async () => {
							return await db.post.findUnique({
								where: {
									id: params.crumbId,
								},
								include: {
									votes: true,
								},
							});
						}}
					/>
				</Suspense>

				<div className='sm:w-0 w-full h-full flex-1 bg-dm-secondary p-4 rounded-r-md text-text-darkMode'>
					<p className='max-h-40 mt-1 truncate text-xs'>
						dropped by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
						{formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
					</p>
					<h1 className='text-xl font-semibold py-2 leading-6'>
						{post?.title ?? cachedPost.title}
					</h1>
					<EditorOutput content={post?.content ?? cachedPost.content} />

					{/* comments */}

					<Suspense
						fallback={<Loader2 className='h-5 w-5 animate-spin text-white' />}
					>
						{/* @ts-expect-error server component */}
						<CrumbComments crumbId={post?.id || cachedPost.id} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

function CrumbVoteShell() {
	return (
		<div className='flex items-center flex-col pr-6 w-20'>
			<div className={buttonVariants({ variant: "ghost" })}>
				<ArrowBigUp className='w-5 h-5' />
			</div>
			<div className='text-center py-2 font-medium text-sm'>
				<Loader2 className='h-3 w-3 animate-spin' />
			</div>
			<div className={buttonVariants({ variant: "ghost" })}>
				<ArrowBigDown className='w-5 h-5' />
			</div>
		</div>
	);
}

export default page;
