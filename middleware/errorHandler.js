module.exports = (err, req, res, next) => {
    // console.log(err);

    let status = err.status || 500;
    let message = err.message || 'Internal server error';

    switch (err.name) {
        case 'Unauthorized':
            status = 401;
            message = err.message;
            break;
        case 'NotFound':
            status = 404;
            message = 'Postingan not found';
            break;
        case 'Unauthenticated':
            status = 401;
            message = 'Unauthenticated';
            break;
        case 'Unauthenticated token type':
            status = 401;
            message = 'Unauthenticated token type';
            break;
        case 'Unauthenticated token':
            status = 401;
            message = 'Unauthenticated token';
            break;
        case 'SequelizeValidationError':
            status = 400;
            message = err.errors[0].message;
            break;
        case "BadRequest":
            status = 400;
            message = err.message;
            break;
        case 'JsonWebTokenError':
            message = 'Invalid token';
            break;
        default:
            break;
    }

    res.status(status).json({
        message: message,
        source: 'error handler'
    });
};