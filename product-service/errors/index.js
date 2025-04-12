class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.isOparational = true;
    }
}

class NotFoundError extends AppError{
    constructor(message = 'Resource not found'){
        super(message, 404)
    }
}

export {
    AppError,
    NotFoundError
}