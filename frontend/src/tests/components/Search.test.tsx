import "@testing-library/jest-dom/vitest";

import {server} from "../../mocks/node.js";
import {describe, test, expect, beforeEach, afterEach, vi} from "vitest";
import {screen, render, cleanup, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import path from "path";
import fs from "fs";
import {delay, http, HttpResponse} from "msw";
import { BACKEND_URL } from "../../constants/environments";

describe("Tests in Search.tsx", () => {
	beforeEach(() => {
		//localStorage.clear is used to clear the local storage before each test, ensuring that no previous data affects the current test.
		localStorage.clear();
		// You have to put this when you want to reset all the mocks (mocks and spies) such as call counts and mock state, but the function is still mocked.
		vi.clearAllMocks();
	});

	afterEach(() => {
		//This will unmount any rendered components and reset the DOM after each test case. Usually, you only need this if you have custom setups or side effects. For most cases, React Testing Library handles cleanup automatically.
		cleanup();
		//You have to put this when you want remove the mock and restore the original value of the mocks (mocks and spies) after each test.
		vi.restoreAllMocks();
	});

	const getFileForm = () => screen.getByRole("form", {name: /upload-form/i});
	const getNotFileForm = () =>
		screen.queryByRole("form", {name: /upload-form/i});
	const getFileInput = () =>
		within(getFileForm()).getByLabelText(/file-input/i) as HTMLInputElement;
	const getFileButton = () =>
		within(getFileForm()).getByRole("button", {name: /upload-file/i});
	const getSearchForm = () => screen.getByRole("form", {name: /search-form/i});
	const getSearchInput = () =>
		within(getSearchForm()).getByRole("searchbox", {name: "search-input"});
	const getListResults = () => screen.getByRole("list", {name: "list-results"});
	const getListItems = () =>
		screen.getAllByRole("listitem", {name: "list-item"});

	const user = userEvent.setup();

	const getFileCsv = (pathFile: string) => {
		const csvPath = path.join(__dirname, pathFile);
		const csvContent = fs.readFileSync(csvPath, "utf-8");
		const file = new File([csvContent], "demo.csv", {type: "text/csv"});
		return file;
	};

	const processFileCSV = async (file: File) => {
		await user.upload(getFileInput(), file);
		await user.click(getFileButton());
	};

	const mockServiceFilterData = ({
		body,
		status,
	}: {
		body: any;
		status?: number;
	}) => {
		server.use(
			http.get(`${BACKEND_URL}/api/files`, async () => {
				await delay(300);
				return HttpResponse.json(body, {status});
			})
		);
	};
	test("should filter the results when type in the search input", async () => {
		render(<App />);
		const file = getFileCsv("../../../../demo.csv");
		await processFileCSV(file);

		await waitFor(
			() => {
				expect(getNotFileForm()).not.toBeInTheDocument();
			},
			{timeout: 1000}
		);

		await user.type(getSearchInput(), "alice");
		await waitFor(
			() => {
				expect(getListItems()).toHaveLength(1);
			},
			{timeout: 1000}
		);
	});
	test("should show all the results when clear the search input", async () => {
		render(<App />);
		const file = getFileCsv("../../../../demo.csv");
		await processFileCSV(file);

		await waitFor(
			() => {
				expect(getNotFileForm()).not.toBeInTheDocument();
			},
			{timeout: 1000}
		);

		await user.type(getSearchInput(), "alice");
		await user.clear(getSearchInput());

		await waitFor(
			() => {
				expect(getListItems()).toHaveLength(10);
			},
			{timeout: 1000}
		);
	});
	test("should show the results automatically according to the query parameter in the URL", async () => {
		window.history.replaceState({}, "", "?q=alice");
		render(<App />);
		const file = getFileCsv("../../../../demo.csv");
		await processFileCSV(file);

		await waitFor(
			() => {
				expect(getListItems()).toHaveLength(1);
			},
			{timeout: 1000}
		);
	});
	test("should not show any results if the query parameter in the URL does not match any record", async () => {
		window.history.replaceState({}, "", "?q=notfound");
		render(<App />);
		const file = getFileCsv("../../../../demo.csv");
		await processFileCSV(file);

		await waitFor(
			() => {
				expect(getListResults().childNodes).toHaveLength(0);
			},
			{timeout: 1000}
		);
	});
	test("should show a error message if the filter data service fails", async () => {
		mockServiceFilterData({body: {message: "Filter Failed"}, status: 500});
		render(<App />);
		const file = getFileCsv("../../../../demo.csv");
		await processFileCSV(file);

		await waitFor(
			() => {
				expect(screen.getByRole("region")).toHaveTextContent(/filter failed/i);
			},
			{timeout: 1000}
		);
		expect(getListResults().childNodes).toHaveLength(0);	
	});

});
