import { errorResponse } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error('ERROR:', err);

  return errorResponse(res, err, statusCode);
};

export default errorHandler;