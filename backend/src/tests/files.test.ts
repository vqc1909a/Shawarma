import request from 'supertest';
import {describe, test, expect} from "vitest";
import { app } from '../../server.ts';
import path from 'path';

describe('Tests about files API', () => {
  
  test("POST /api/files - should upload the file", async () => {
    const response = await request(app)
			.post("/api/files")
			.attach("file", path.join(__dirname, "../../demo.csv"))
      .expect("Content-Type", /application\/json/i)
			.expect(200);

    expect(response.body).toEqual({
			message: expect.stringMatching(/The file was uploaded successfully/i),
			body: expect.any(Array),
		});
    expect(response.body.body).toHaveLength(10);
    expect(response.statusCode).toBe(200);
  });

  test("GET /api/files - should return filtered data based on query param 'q'", async () => {
    const response = await request(app)
      .get("/api/files")
      .query({ q: "alice" })
      .expect("Content-Type", /application\/json/i)
      .expect(200);

    expect(response.body).toEqual({
			message: expect.stringMatching(/Data retrieved successfully/i),
			body: expect.any(Array),
		});

    expect(response.body.body).toHaveLength(1);
    expect(response.statusCode).toBe(200);
  });
});