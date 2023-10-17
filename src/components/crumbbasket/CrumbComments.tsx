import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import CrumbComment from "./CrumbComment";
import CreateComment from "./CreateComment";

interface CrumbCommentsProps {
	crumbId: string;
}

const CrumbComments = async ({ crumbId }: CrumbCommentsProps) => {
	const session = await getAuthSession();

	const comments = await db.comment.findMany({
		where: {
			postId: crumbId,
			replyToId: null,
		},
		include: {
			author: true,
			votes: true,
			replies: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	return (
		<div className='flex flex-col gap-y-4 mt-4 bg-bg-darkMode rounded-sm'>
			<hr className='w-1/3 md:w-1/2 mx-auto h-px my-0 py-0 border-dm-accent' />
			<CreateComment crumbId={crumbId} />
			<hr className='w-full h-px my-3 border-dm-accent' />

			<div className='flex flex-col gap-y-6 mt-2'>
				{comments
					.filter((comment) => !comment.replyToId)
					.map((topLvlComment) => {
						const topLvlCommentVotesAmount = topLvlComment.votes.reduce(
							(acc, vote) => {
								if (vote.type === "UP") return acc + 1;
								if (vote.type === "DOWN") return acc - 1;
								acc;
							},
							0
						);

						const topLvlCommentVote = topLvlComment.votes.find(
							(vote) => vote.userId === session?.user.id
						);

						return (
							<div key={topLvlComment.id} className='flex flex-col'>
								<div className='mb-2'>
									<CrumbComment
										crumbId={crumbId}
										currentVote={topLvlCommentVote}
										votesAmount={topLvlCommentVotesAmount}
										comment={topLvlComment}
									/>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default CrumbComments;
