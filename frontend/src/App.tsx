import {useState, type ChangeEvent, type FormEvent} from "react";
import "./App.css";
import {uploadFile} from "./services/uploadFile";
import {toast, Toaster} from "sonner";
import {Search} from "./components/Search";
import { useSEO } from "./hooks/useSeo";

const APP_STATUS = {
	IDLE: "idle",
	ERROR: "error",
	READY_UPLOAD: "ready_upload",
	UPLOADING: "uploading",
	READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
	[APP_STATUS.IDLE]: "Upload File",
	[APP_STATUS.ERROR]: "Retry",
	[APP_STATUS.READY_UPLOAD]: "Ready to Upload",
	[APP_STATUS.UPLOADING]: "Uploading...",
	[APP_STATUS.READY_USAGE]: "Ready to Use",
} as const;

type APP_STATUS_TYPE = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
	useSEO({
		title: "Uploading CSV App",
		description: "A simple app for uploading and processing CSV files",
	});
	
	const [appStatus, setAppStatus] = useState<APP_STATUS_TYPE>(APP_STATUS.IDLE);
	const [data, setData] = useState<Array<Record<string, string>>>([]);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAppStatus(APP_STATUS.READY_UPLOAD);
		}
	};

	const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const elements = e.currentTarget.elements;
		const input = elements.namedItem("file") as HTMLInputElement;
		const file = input.files?.[0];

		if (!file || appStatus !== APP_STATUS.READY_UPLOAD) {
			toast.error("Please select a valid CSV.");
			setAppStatus(APP_STATUS.ERROR);
			return;
		}
		setAppStatus(APP_STATUS.UPLOADING);

		const formData = new FormData();
		formData.append("file", file);
		try {
			const {message, body} = await uploadFile(formData);
			setAppStatus(APP_STATUS.READY_USAGE);
			setData(body);
			toast.success(message);
		} catch (err: any) {
			setAppStatus(APP_STATUS.ERROR);
			setData([]);
			toast.error(err.message);
		}
	};

	const showButton =
		appStatus !== APP_STATUS.READY_USAGE && appStatus !== APP_STATUS.IDLE;
	const showInput = appStatus !== APP_STATUS.READY_USAGE;

	return (
		<>
			<h1>Upload CSV + Search</h1>
			<Toaster />
			{showInput && (
				<form onSubmit={onFormSubmit} aria-label="upload-form">
					<label>
						<input
							disabled={appStatus === APP_STATUS.UPLOADING}
							name="file"
							type="file"
							accept=".csv"
							onChange={onInputChange}
							aria-label="file-input"
						/>
					</label>
					{showButton && (
						<button
							type="submit"
							disabled={appStatus === APP_STATUS.UPLOADING}
							aria-label="upload-file"
						>
							{BUTTON_TEXT[appStatus]}
						</button>
					)}
				</form>
			)}
			{appStatus === APP_STATUS.READY_USAGE && <Search initialData={data} />}
		</>
	);
}

export default App;
