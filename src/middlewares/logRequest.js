const logRequest = (req,res,next) => {
    console.log(`${req.method} ${req.url} from ${req.connection.remoteAddress}`);
    next();
}

module.exports = logRequest;