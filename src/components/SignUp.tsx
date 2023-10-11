import { Icons } from "@/components/Icons";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import UserAuthForm from "@/components/UserAuthForm";

const SignUp = () => {
	return (
		<div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] '>
			<div className='flex flex-col space-y-2 text-center'>
				<div className='mx-auto'>
					<Icons.cookie className='h-8 w-8' />
				</div>
				<h1 className='text-2xl font-semibold -tracking-tight'>Welcome!</h1>
				<p className='text-xs max-w-xs mx-auto pt-4'>
					By continuing you are setting up, or utilizing, a crumbit account and
					agree to the crumbit User Agreement and Privacy Policy
				</p>

				{/* signUp form/btn */}
				<UserAuthForm className='pt-4' />

				<p className='px-8 text-center text-sm text-text-darkMode pt-6'>
					Already on crumbit?{" "}
					<Link
						href='/login'
						className={buttonVariants({
							variant: "link",
							className:
								"text-text-darkMode hover:underline underline-offset-4",
						})}
					>
						Login!
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignUp;
