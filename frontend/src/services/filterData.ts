import { BACKEND_URL } from "../constants/environments";

interface FilterDataResponse {
  message: string;
  body: Array<Record<string, string>>
} 
export const filterData = async (query: string): Promise<FilterDataResponse> => {
	const response = await fetch(`${BACKEND_URL}/api/files?q=${query}`);
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error?.message || "Failed to filter data");
	}
	return response.json();
};
