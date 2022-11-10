import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.js";

class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
