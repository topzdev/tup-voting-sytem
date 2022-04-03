"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err) {
        // if (err.stack) console.error(err.stack);
        res.status(err.statusCode || 500).json({
            error: {
                name: err.name,
                message: err.message,
                statusCode: err.statusCode,
                fields: err.fields,
            },
        });
        return;
    }
    next();
};
exports.default = errorHandler;
//# sourceMappingURL=error-handlers.middleware.js.map