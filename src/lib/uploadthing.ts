import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const cstmUploadBtn = ({ ...props }: any) =>
	UploadButton<OurFileRouter>({ ...props });
export const cstmUploadDropzone = ({ ...props }: any) =>
	UploadDropzone<OurFileRouter>({ ...props });

// doc templated code from below URL appeared broken on use, {generateComponents} didnt exist, only the 2 on line 1 above existed
// reformatted to assign <Generic> similarly to each
// https://docs.uploadthing.com/nextjs/appdir#creating-the-uploadthing-components-optional
/*
import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "~/app/api/uploadthing/core";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();
  
  */

//   the below code was found to work specific on file uploads, not referenced in basic docs from uploadthing that I could find
import { generateReactHelpers } from "@uploadthing/react/hooks";
export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
