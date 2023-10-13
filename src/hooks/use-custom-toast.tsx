import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
	const loginToast = () => {
		const { dismiss } = toast({
			title: "login required",
			description: "please sign in to do that",
			variant: "destructive",
			action: (
				<Link
					href={"/login"}
					onClick={() => dismiss()}
					className={buttonVariants({ variant: "outline" })}
				>
					Login
				</Link>
			),
		});
	};

	return { loginToast };
};
