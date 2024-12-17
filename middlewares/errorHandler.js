const { CustomError } = require('../errors/customError')

const handleError = (error, req, res, next) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500)
              .json({ error: "Something went wrong, please try again!\\nAlso, make sure that you have provided all required fields in the correct format!" });
};


module.exports = {handleError}