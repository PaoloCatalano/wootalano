import { StatusCodes } from "http-status-codes";

const errorHandler = (error, req, res, next) => {
  const defaultError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      error.message || "mmh...something is not working as expected, my bad!!",
  };
  if (error.name === "ValidationError") {
    (defaultError.statusCode = StatusCodes.BAD_REQUEST),
      (defaultError.msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(", "));
  }
  if (error.code && error.code === 11000) {
    defaultError.msg = `I've seen you before.. I remember this ${Object.keys(
      error.keyValue
    )}! Try with another one.`;
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (error.name === "CastError") {
    defaultError.msg = `No item found with id : ${error.value}`;
    defaultError.statusCode = 404;
  }

  return res.status(defaultError.statusCode).json({ msg: defaultError.msg });
};

export default errorHandler;
