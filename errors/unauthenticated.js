import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.js";

class Unauthenticated extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default Unauthenticated;
