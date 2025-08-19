import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

let userData: Array<Record<string, string>> = [];

app.get("/", (req, res) => {
	return res.send("Hello, Worasdald!");
});

app.post("/api/files", upload.single("file"), async (req, res) => {
	// 1. Extract file from request
	const file = req.file;
	// {
	//   file: {
	//     fieldname: 'file',
	//     originalname: 'demo.csv',
	//     encoding: '7bit',
	//     mimetype: 'text/csv',
	//     buffer: <Buffer >,
	//     size: 0
	//   },
	//   mimetype: 'text/csv'
	// }

	// 2. Validate that we have file
	if (!file) {
		return res.status(500).json({message: "File is required"});
	}
	// 3. Validate the mimetype (csv)
	if (file.mimetype !== "text/csv") {
		return res.status(400).json({message: "File must be a CSV"});
	}
	try {
		// 4. Transform the file (Buffer) to string
		// converts the uploaded file's binary data (Buffer) into a readable string using UTF-8 encoding.
		const csvString = file.buffer.toString("utf-8");
		// 5. Transform string (csv) to JSON
    const delimiter = csvString.includes(";") ? ";" : ",";
		const json = csvToJson.fieldDelimiter(delimiter).csvStringToJson(csvString);
		// 6. Save the JSON to db (or memory)
		userData = json;
	} catch (err) { 
		return res
			.status(400)
			.json({message: "Error processing the CSV file", error: err.message});
	}

	// 7. Return 200 with the message and the JSON
	return res
		.status(200)
		.json({message: "The file was uploaded successfully", body: userData});
});

app.get("/api/users", async (req, res) => {
	// 1. Extract the query params 'q' from the request
  const query: string = req.query.q;
	// 2. Validate that we have query query
  if(!query){
    return res.status(400).json({message: "Query param 'q' is required"});
  }
	// 3. Filter the data from the db (or memory) with the query params
  const filteredData = userData.filter(row => {
    return Object.values(row).some((value) => value.includes(query.toLowerCase()));
  });

	// 4. Return 200 with the filtered data
	return res.status(200).json({message: "Data retrieved successfully", body: filteredData});
});
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
