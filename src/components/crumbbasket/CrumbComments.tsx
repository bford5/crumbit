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
								return acc;
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
								{/* render comment replies here */}
								{topLvlComment.replies
									.sort((a, b) => (b.votes.length = a.votes.length))
									.map((sortedReplyData) => {
										const replyVotesAmount = sortedReplyData.votes.reduce(
											(acc, vote) => {
												if (vote.type === "UP") return acc + 1;
												if (vote.type === "DOWN") return acc - 1;
												return acc;
											},
											0
										);

										const replyVote = sortedReplyData.votes.find(
											(vote) => vote.userId === session?.user.id
										);

										return (
											<div
												key={sortedReplyData.id}
												className='xs:ml-1 sm:ml-3 md:ml-5 py-2 pl-4 border-l-2 border-dm-primary'
											>
												<CrumbComment
													comment={sortedReplyData}
													currentVote={replyVote}
													votesAmount={replyVotesAmount}
													crumbId={crumbId}
												/>
											</div>
										);
									})}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default CrumbComments;
