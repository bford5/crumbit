"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// --
import { crumbCreationRequest, crumbValidator } from "@/lib/validators/crumb";
// --
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface WYSIWYGEditorProps {
	crumbbasketId: string;
}

const WYSIWYGEditor: FC<WYSIWYGEditorProps> = ({ crumbbasketId }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<crumbCreationRequest>({
		resolver: zodResolver(crumbValidator),
		defaultValues: {
			crumbbasketId,
			title: "",
			content: null,
		},
	});

	const editorInitRef = useRef<EditorJS>();
	const [isEditorMounted, setIsEditorMounted] = useState<boolean>(false);
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const pathname = usePathname();
	const router = useRouter();

	// streaming in the editor for UX
	const initializeEditor = useCallback(async () => {
		const EditorJS = (await import("@editorjs/editorjs")).default;
		const Header = (await import("@editorjs/header")).default;
		const Embed = (await import("@editorjs/embed")).default;
		const Table = (await import("@editorjs/table")).default;
		const List = (await import("@editorjs/list")).default;
		const Code = (await import("@editorjs/code")).default;
		const LinkTool = (await import("@editorjs/link")).default;
		const InlineCode = (await import("@editorjs/inline-code")).default;
		const ImageTool = (await import("@editorjs/image")).default;

		if (!editorInitRef.current) {
			const editor = new EditorJS({
				holder: "editor",
				onReady() {
					editorInitRef.current = editor;
				},
				placeholder: "type here to write your crumb",
				inlineToolbar: true,
				data: { blocks: [] },
				tools: {
					header: Header,
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: "/api/link",
						},
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								async uploadByFile(file: File) {
									const [res] = await uploadFiles([file], "imageUploader");
									return {
										success: 1,
										file: {
											url: res.fileUrl,
										},
									};
								},
							},
						},
					},
					list: List,
					code: Code,
					inlineCode: InlineCode,
					embed: Embed,
					table: Table,
				},
			});
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsEditorMounted(true);
		}
	}, []);

	useEffect(() => {
		if (Object.keys(errors).length) {
			for (const [_key, value] of Object.entries(errors)) {
				toast({
					title: "an error occurred",
					description: (value as { message: string }).message,
					variant: "destructive",
				});
			}
		}
	}, [errors]);

	useEffect(() => {
		const init = async () => {
			await initializeEditor();

			setTimeout(() => {
				// set focus to title
				_titleRef.current?.focus();
			}, 0);
		};

		if (isEditorMounted) {
			init();

			return () => {
				editorInitRef.current?.destroy();
				editorInitRef.current = undefined;
			};
		}
	}, [isEditorMounted, initializeEditor]);

	const { mutate: createCrumb } = useMutation({
		mutationFn: async ({
			title,
			content,
			crumbbasketId,
		}: crumbCreationRequest) => {
			const payload: crumbCreationRequest = {
				crumbbasketId,
				title,
				content,
			};
			const { data } = await axios.post(
				"/api/crumbbasket/crumb/create",
				payload
			);
			return data;
		},
		onError: () => {
			return toast({
				title: "an error occurred",
				description: "could not submit request",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			// from /c/SLUG/submit -> /c/SLUG
			const newPathName = pathname.split("/").slice(0, -1).join("/");
			router.push(newPathName);
			router.refresh();

			return toast({
				title: "success",
				description: "crumb dropped into crumbbasket",
				variant: "default",
			});
		},
	});

	async function onCrumbSubmit(data: crumbCreationRequest) {
		const blocks = await editorInitRef.current?.save();

		const payload: crumbCreationRequest = {
			title: data.title,
			content: blocks,
			crumbbasketId,
		};

		createCrumb(payload);
	}

	if (!isEditorMounted) {
		return null;
	}

	const { ref: titleRef, ...theRestofProps } = register("title");

	return (
		<div className='w-full p-4 bg-dm-secondary rounded-lg '>
			<form
				className='w-fit text-text-darkMode mx-auto'
				id='crumbbasket-post-form'
				onSubmit={handleSubmit(onCrumbSubmit)}
			>
				<div className='prose prose-purple dark:prose-invert'>
					<TextareaAutosize
						ref={(e) => {
							titleRef(e);
							// @ts-ignore
							_titleRef.current = e;
						}}
						{...theRestofProps}
						placeholder='Title'
						className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none text-text-darkMode selection:bg-dm-primary selection:text-text-lightMode border-l border-b border-dm-accent pl-2 pb-2 rounded-bl-md mb-1'
					/>
					<div
						id='editor'
						className='min-h-[369px] bg-bg-darkMode py-2 px-4 rounded-md selection:bg-dm-primary selection:text-text-lightMode text-text-darkMode'
					/>
				</div>
			</form>
		</div>
	);
};

export default WYSIWYGEditor;
