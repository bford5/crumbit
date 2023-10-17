import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import CrumbVoteClient from "./crumb-vote/CrumbVoteClient";

type PartialVote = Pick<Vote, "type">;

interface CrumbProps {
	crumbbasketName: string;
	crumb: Post & {
		author: User;
		votes: Vote[];
	};
	commentAmount: number;
	votesAmount: number;
	currentVote?: PartialVote;
}

const Crumb: FC<CrumbProps> = ({
	crumbbasketName,
	crumb,
	commentAmount,
	votesAmount,
	currentVote,
}) => {
	const crumbViewRef = useRef<HTMLDivElement>(null);

	return (
		<div className='rounded-md bg-dm-secondary border border-lm-primary shadow'>
			<div className='px-6 py-4 flex justify-between'>
				{/* {TODO: CrumbVotes} */}
				<CrumbVoteClient
					initialVotesAmount={votesAmount}
					crumbId={crumb.id}
					initialVote={currentVote?.type}
				/>

				<div className='w-full flex-1'>
					<div className='max-h-40 mt-1 text-xs text-text-darkMode'>
						{crumbbasketName ? (
							<>
								<a
									className='underline underline-offset-4 text-text-darkMode'
									href={`/c/${crumbbasketName}`}
								>
									c/{crumbbasketName}
								</a>
								<span className='px-1'>-</span>
							</>
						) : null}
						<span>dropped by u/{crumb.author.username}</span>{" "}
						{formatTimeToNow(new Date(crumb.createdAt))}
					</div>
					<a href={`/c/${crumbbasketName}/crumb/${crumb.id}`} className=''>
						<h1 className='text-lg font-semibold py-2 leading-6 text-text-darkMode hover:text-dm-accent transition-all duration-150'>
							{crumb.title}
						</h1>
					</a>
					<div
						className='relative text-sm max-h-40 w-full overflow-clip'
						ref={crumbViewRef}
					>
						<EditorOutput content={crumb.content} />
						{crumbViewRef.current?.clientHeight == 160 ? (
							<div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent' />
						) : null}
					</div>
				</div>
			</div>

			<div className='bg-dm-secondary z-20 text-sm p-4 sm:px-6 rounded-lg'>
				<a
					href={`/c/${crumbbasketName}/crumb/${crumb.id}`}
					className='w-fit flex items-center hover:text-dm-accent transition-all duration-150'
				>
					<MessageSquare className='h-4 w-4 mr-1' /> {commentAmount} comments
				</a>
			</div>
		</div>
	);
};

export default Crumb;
