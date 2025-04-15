const errorHandler = (err, req, res, next) => {
	console.error(err);

	const status = err.status || 500;
	const message = err.message || 'An unexpected error occurred.';

	return res.status(status).json({ success: false, message });
};

module.exports = errorHandler;