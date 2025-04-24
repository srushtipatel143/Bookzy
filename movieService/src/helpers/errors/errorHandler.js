class errorHandler extends Error {
    constructor(message, statusCode, errorDetails=null) {
        super(message);
        this.statusCode = statusCode;
        if (errorDetails instanceof Error) {
            this.error = {
                name: errorDetails.name,
                message: errorDetails.message,
                stack: errorDetails.stack,
            };
        } else {
            this.error = errorDetails || { message };
        }
    }
}

module.exports = errorHandler;
