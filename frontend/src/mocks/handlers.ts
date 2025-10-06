import {http, HttpResponse, delay} from "msw";
import {BACKEND_URL} from "../constants/environments";
const userData: Array<Record<string, string>> = [
	{
		Name: "Alice",
		Email: "alice@example.com",
		Age: "30",
		Country: "USA",
		Occupation: "Engineer",
	},
	{
		Name: "Bob",
		Email: "bob@example.com",
		Age: "25",
		Country: "Canada",
		Occupation: "Designer",
	},
	{
		Name: "Charlie",
		Email: "charlie@example.com",
		Age: "35",
		Country: "UK",
		Occupation: "Manager",
	},
	{
		Name: "Diana",
		Email: "diana@example.com",
		Age: "28",
		Country: "Germany",
		Occupation: "Developer",
	},
	{
		Name: "Ethan",
		Email: "ethan@example.com",
		Age: "40",
		Country: "France",
		Occupation: "Architect",
	},
	{
		Name: "Fiona",
		Email: "fiona@example.com",
		Age: "32",
		Country: "Italy",
		Occupation: "Scientist",
	},
	{
		Name: "George",
		Email: "george@example.com",
		Age: "29",
		Country: "Spain",
		Occupation: "Artist",
	},
	{
		Name: "Hannah",
		Email: "hannah@example.com",
		Age: "27",
		Country: "Australia",
		Occupation: "Teacher",
	},
	{
		Name: "Ivan",
		Email: "ivan@example.com",
		Age: "33",
		Country: "Russia",
		Occupation: "Doctor",
	},
	{
		Name: "Julia",
		Email: "julia@example.com",
		Age: "31",
		Country: "Brazil",
		Occupation: "Writer",
	},
];
export const handlers = [
	http.post(`${BACKEND_URL}/api/files`, async ({request}) => {
    await delay(300);
		// const {slug} = params;
		// const data = await request.json();
		const formData = await request.formData();
		const file = formData.get("file");
    // File {
    //   type: 'text/csv',
    //   lastModified: 1756368371875,
    //   name: 'demo.csv',
    //   [Symbol(buffer)]: <Buffer 4e 61 6d 65 3b 45 6d 61 69 6c 3b 41 67 65 3b 43 6f 75 6e 74 72 79 3b 4f 63 63 75 70 61 74 69 6f 6e 0a 41 6c 69 63 65 3b 61 6c 69 63 65 40 65 78 61 6d ... 406 more bytes>
    // }
		if (!file) {
			return HttpResponse.json({message: "File is required"}, {status: 400});
		}

	  if (!(file instanceof File) || file.type !== "text/csv") {
			return HttpResponse.json({message: "File must be a CSV"}, {status: 400});
		}

		return HttpResponse.json(
			{
				message: "The file was uploaded successfully",
				body: userData,
			},
			{status: 200}
		);
	}),
	
	http.get(`${BACKEND_URL}/api/files`, async ({request}) => {
    await delay(300);
		const url = new URL(request.url);
    const query = url.searchParams.get("q");
    if(!query){
      return HttpResponse.json({message: "Query param 'q' is required"}, {status: 400});
    }
		const filteredData = userData.filter(row => {
			return Object.values(row).some((value) => value.includes(query.toLowerCase()));
		});

		return HttpResponse.json({message: "Data retrieved successfully", body: filteredData});
	}),
];
