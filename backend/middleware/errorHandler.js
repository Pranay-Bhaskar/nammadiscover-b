const notFound = (req, res, next) => {
    const error = new Error(`Not found — ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error('❌ Error:', err.message);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Max 500 MB.' });
    }
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors).map(e => e.message).join(', ');
        return res.status(400).json({ error: msg });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ error: `${field} already exists` });
    }

    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

module.exports = { notFound, errorHandler };
