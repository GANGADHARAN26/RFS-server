const Joi = require("joi");

const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("ADMIN", "HR", "EMP", "CAND").required().messages({
      'any.required': 'Role is required.',
      'any.only': 'Role must be one of [admin, user, manager].',
    }),
  });
  return schema.validate(data);
};

module.exports = { validateRegistration };
