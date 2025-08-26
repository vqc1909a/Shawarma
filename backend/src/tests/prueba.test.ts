import request from "supertest";
import {describe, test, expect} from "vitest";
import {app} from "../../server.ts";
describe("Tests about getting up of the app", () => {
	test("GET / - should return API is running", async () => {
		const response = await request(app)
			.get("/")
			.expect("Content-Type", /text\/html/)
			.expect(200);

		expect(response.body).toEqual({});
		expect(response.text).toMatch(/Hello, World!/i);
		expect(response.statusCode).toBe(200);
	});
});
