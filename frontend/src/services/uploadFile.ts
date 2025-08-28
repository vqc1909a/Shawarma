import { BACKEND_URL } from "../constants/environments";

interface UploadFileResponse {
  message: string;
  body: Array<Record<string, string>>
} 
export const uploadFile = async (form: FormData): Promise<UploadFileResponse> => {
	const response = await fetch(`${BACKEND_URL}/api/files`, {
		method: "POST",
		body: form,
	});
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || "Failed to upload file");
	}
	return response.json();
};
