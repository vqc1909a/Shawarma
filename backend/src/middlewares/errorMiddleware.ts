export const errorMiddleware = (err, req, res) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	const message = err.message || "Internal Server Error";
	const stack = process.env.NODE_ENV === "production" ? null : err.stack;
  return res.status(statusCode).json({
		message,
		stack,
	});
};
