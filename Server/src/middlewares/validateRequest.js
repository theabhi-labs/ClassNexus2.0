// src/middlewares/validateRequest.js
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        details: error.details.map(d => d.message)
      });
    }
    next(); // ✅ pass to the controller
  };
};

export default validateRequest;