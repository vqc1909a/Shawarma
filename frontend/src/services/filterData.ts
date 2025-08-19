import { BACKEND_URL } from "../constants/environments";

interface FilterDataResponse {
  message: string;
  body: Array<Record<string, string>>
} 
export const filterData = async (query: string): Promise<FilterDataResponse> => {
	const response = await fetch(`${BACKEND_URL}/api/users?q=${query}`, {});
	if (!response.ok) {
		throw new Error("Failed to filter data");
	}
	return response.json();
};
