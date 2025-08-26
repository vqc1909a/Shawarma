import express from "express";
import cors from "cors";
import { filesRouter } from "./src/routes/filesRoute.ts";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
	return res.send("Hello, World!");
});

app.use("/api/files", filesRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
