 const sendResponse = ({ res, statusCode = 200, message = "", data = null, success=true }) => {
  const response = {
    message,
    data: data || null,
    success
  };

  res.status(statusCode).json(response);
};

module.exports = {sendResponse}