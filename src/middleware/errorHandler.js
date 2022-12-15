exports.errorHandler = (err, req, res, next) => {
    if (err) {
        console.log(`error caught by error handler ${err}`);
        return res.status(err.status || 500).json({ error: err.message })
    }
}