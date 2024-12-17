const { CustomError } = require('../errors/customError')

const handleError = (error, req, res, next) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500)
              .json({ error: "Something went wrong, please try again!" });
};


module.exports = {handleError}