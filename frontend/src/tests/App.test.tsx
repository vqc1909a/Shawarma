import "@testing-library/jest-dom/vitest";

import {describe, test, expect, beforeEach, afterEach, vi} from "vitest";
import {screen, render, cleanup, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import path from 'path';
import fs from "fs";

describe("Tests in App.tsx", () => {
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
  const getNotFileForm = () => screen.queryByRole("form", {name: /upload-form/i});
  const getFileInput = () => within(getFileForm()).getByLabelText(/file-input/i) as HTMLInputElement;
  const getFileButton = () => within(getFileForm()).getByRole("button", {name: /upload-file/i});
  const getNotFileButton = () => within(getFileForm()).queryByRole("button", {name: /upload-file/i});

  const getSearchForm = () => screen.getByRole("form", {name: /search-form/i});
  const getSearchInput = () => within(getSearchForm()).getByRole("searchbox", {name: "search-input"});
  const getListResults = () => screen.getByRole("list", {name: "list-results"});
  const getListItems = () => screen.getAllByRole("listitem", {name: "list-item"});

  const getFileCsv = (pathFile: string) => {
    const csvPath = path.join(__dirname, pathFile);
		const csvContent = fs.readFileSync(csvPath, "utf-8");
		const file = new File([csvContent], "demo.csv", {type: "text/csv"});
    return file;
  }

  const processFileCSV = async (file: File) => {
    await userEvent.upload(getFileInput(), file);
		await userEvent.click(getFileButton());
  }

	test("should render the title correctly", () => {
		render(<App />);
		expect(screen.getByRole("heading", {level: 1, name: /upload csv/i}));
	});
	test("should not show the submit button in the first render", () => {
		render(<App />);
		expect(
			getFileForm()
		).toBeInTheDocument();
		expect(
			getNotFileButton()
		).not.toBeInTheDocument();
	});
  test("should load the file successfully", async () => {
    render(<App />);
    const file = getFileCsv("../../../demo.csv");
    expect(getFileInput()).toBeInTheDocument();

    await userEvent.upload(getFileInput(), file);
    // log => input.files
    // {
    //   files: FileList {
    //     '0': File {},
    //     length: 1,
    //     item: [Function: item],
    //     constructor: [class FileList],
    //     [Symbol(Symbol.iterator)]: [GeneratorFunction: nextFile]
    //   }
    // }
    expect(getFileInput().files).toHaveLength(1);
    expect(getFileInput().files![0]).toStrictEqual(file);
    expect(getFileInput().files?.item(0)).toStrictEqual(file);

    expect(getFileButton()).toBeInTheDocument();
  })
  test("should upload the file successfully and show the results successfully", async () => {
    render(<App />);
    const file = getFileCsv("../../../demo.csv");
    await processFileCSV(file)
    expect(getFileButton()).toBeDisabled();

    await waitFor(() => {
      expect(getNotFileForm()).not.toBeInTheDocument();
    }, {timeout: 1500})

    expect(getSearchForm()).toBeInTheDocument();
    expect(getListResults()).toBeInTheDocument();
    expect(getListItems()).toHaveLength(10);
  });
  test("should filter the results when type in the search input", async () => {
    render(<App />);
    const file = getFileCsv("../../../demo.csv");
    await processFileCSV(file);

    await waitFor(() => {
      expect(getNotFileForm()).not.toBeInTheDocument();
    }, {timeout: 1500});

    await userEvent.type(getSearchInput(), "alice");
    await waitFor(() => {
      expect(getListItems()).toHaveLength(1);
    }, {timeout: 1500});
  });
  test("should show all the results when clear the search input", async () => {
    render(<App />);
    const file = getFileCsv("../../../demo.csv");
    await processFileCSV(file);

    await waitFor(() => {
      expect(getNotFileForm()).not.toBeInTheDocument();
    }, {timeout: 1500});

    await userEvent.type(getSearchInput(), "alice");
    await userEvent.clear(getSearchInput());

    await waitFor(() => {
      expect(getListItems()).toHaveLength(10);
    }, {timeout: 1500})
  });
  test("should show the results automatically according to the query parameter in the URL", async () => {
    window.history.replaceState({}, "", "?q=alice");
    render(<App />);
		const file = getFileCsv("../../../demo.csv");
    await processFileCSV(file);

		await waitFor(() => {
      expect(getListItems()).toHaveLength(1);
		}, {timeout: 1500});
  });
  test("should not show any results if the query parameter in the URL does not match any record", async () => {
    window.history.replaceState({}, "", "?q=notfound");
    render(<App />);
    const file = getFileCsv("../../../demo.csv");
    await processFileCSV(file);

    await waitFor(() => {
      expect(getListResults().childNodes).toHaveLength(0);
    }, {timeout: 1500});
  });
});
