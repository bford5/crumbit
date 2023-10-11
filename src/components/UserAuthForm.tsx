"use client";

import { classNameHelper } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { toast } = useToast();

	const loginWithGoogle = async () => {
		setIsLoading(true);

		try {
			await signIn("google");
		} catch (error) {
			// toast notification
			toast({
				title: "a problem occurred ...",
				description: "there was an error when attempting to login",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={classNameHelper("flex justify-center", className)}
			{...props}
		>
			<Button
				onClick={loginWithGoogle}
				isLoading={isLoading}
				size='sm'
				className='w-full'
			>
				with{" "}
				{/* {isLoading ? <Icons.google className='h-4 w-4 ml-1' /> : " Google"} */}
				{isLoading ? " Google" : <Icons.google className='h-4 w-4 ml-1' />}
			</Button>
		</div>
	);
};

export default UserAuthForm;
