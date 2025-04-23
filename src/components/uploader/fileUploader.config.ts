import { type IFileRestriction } from "./types";

export const fileUploaderRestrictions: IFileRestriction = {
  minFileSize: undefined,
  maxFileSize: undefined,
  minNumberOfFiles: 1,
  maxNumberOfFiles: 1,
  maxTotalFileSize: undefined,
  allowedFileTypes: [".jpeg", ".jpg", ".png"],
};
