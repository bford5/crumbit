"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "../UserAvatar";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
	session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
	const router = useRouter();
	const pathName = usePathname();

	return (
		<>
			<li className='overflow-hidden rounded-md bg-dm-secondary shadow'>
				<div className='h-full px-6 py-4 flex justify-between gap-6'>
					<div className='relative'>
						<UserAvatar
							user={{
								name: session?.user.name || null,
								image: session?.user.image || null,
							}}
						/>
						{session ? (
							<span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-dm-accent  ' />
						) : (
							<span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-red-600  ' />
						)}
					</div>
					<Input
						readOnly
						onClick={() => router.push(pathName + "/submit")}
						placeholder='drop a crumb!'
					/>
					<Button
						variant='custom1'
						onClick={() => router.push(pathName + "/submit")}
						className='px-1'
					>
						<ImageIcon className='text-text-darkMode hover:text-dm-accent transition-all duration-75' />
					</Button>
					<Button
						variant='custom1'
						onClick={() => router.push(pathName + "/submit")}
						className='px-1'
					>
						<Link2 className='text-text-darkMode hover:text-dm-accent transition-all duration-75' />
					</Button>
				</div>
			</li>
		</>
	);
};

export default MiniCreatePost;
