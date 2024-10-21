import { Request, Response, NextFunction } from 'express';
import { phoneSchema, rechargeSchema } from '../schemas';

export const validatePhone = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = phoneSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: error.details[0].message });
    return;
  }
  next();
}

export const validateRecharge = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = rechargeSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: error.details[0].message });
    return;
  }
  next();
};


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
  });
};

