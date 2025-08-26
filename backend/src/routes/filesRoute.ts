import express from "express";
import multer from "multer";
import {getFilesData, postFile} from "../controllers/filesController.ts";
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

export const filesRouter = express.Router();

filesRouter.post("/", upload.single("file"), postFile);

filesRouter.get("/", getFilesData);

