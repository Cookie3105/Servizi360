// server/utils/response.js

export const successResponse = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

export const errorResponse = (res, status = 500, message = "Errore server") => {
  return res.status(status).json({
    success: false,
    message,
  });
};
