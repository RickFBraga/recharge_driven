import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const phoneSchema = Joi.object({
  number: Joi.string().pattern(/^\d+$/).required(),
  carrier_id: Joi.number().required(),
  customer_id: Joi.number().required(),
});

export const validatePhone = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = phoneSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: error.details[0].message });
  } else {
    next();
  }
}

const rechargeSchema = Joi.object({
  phone_id: Joi.number().required(),
  value: Joi.number().min(10).max(1000).required(),
});

export const validateRecharge = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = rechargeSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: error.details[0].message });
  } else {
    next();
  }
};
