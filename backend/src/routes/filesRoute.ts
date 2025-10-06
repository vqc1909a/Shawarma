import express from "express";
import multer from "multer";
import {getFilesData, postFile} from "../controllers/filesController.ts";
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

export const filesRouter = express.Router();

filesRouter.post("/", upload.single("file"), postFile);
filesRouter.get("/", getFilesData);

// In your route, use multer.fields to specify multiple file fields
// upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }])

// In your handler:
// const file = req.files['file']?.[0];   // The uploaded file for 'file'
// const image = req.files['image']?.[0]; // The uploaded file for 'image'

