import express from "express";
// import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import {filesRouter} from "./src/routes/filesRoute.ts";
import { notFoundMiddleware } from "./src/middlewares/notFoundMiddleware.ts";
import { errorMiddleware } from "./src/middlewares/errorMiddleware.ts";

export const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//YOU HAVE TO ENABLE THIS IF YOU WANT TO GET UP YOU  FRONTEND TEST ENVIRONMENT POINTING TO THE BACKEND PORT (4000) AND NOT USING MSW
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/files", filesRouter);

// console.log({
// 	app_env: process.env.APP_ENV,
// 	node_env: process.env.NODE_ENV
// })
// process.env.NODE_ENV is automatically created in test environment using vitest and any deployment platform, only you need to create this variable in you development and production environments but not set this variable (NODE_ENV) in your deployment platform because it's created already

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("/", function (req, res) {
		return res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
	});
} else {
	app.get("/", (req, res) => {
		return res.send("Hello, World!");
	});
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.listen(PORT, () => {
	console.log(`API is running on http://localhost:${PORT}`);
});
