import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const phoneSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  operator: Joi.string().required(),
  cpf: Joi.string().required(),
});

export const validatePhone = (req: Request, res: Response, next: NextFunction): Response | void => {
  const { error } = phoneSchema.validate(req.body);
  if (error) {
    return res.status(422).json({ error: error.details.map((detail) => detail.message) });
  }
  next();
};
