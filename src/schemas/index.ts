import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Phone, Recharge } from '../protocols';

export const phoneSchema = Joi.object<Phone>({
  number: Joi.string().length(11).required(),  
  carrier_id: Joi.number().required(),
  cpf: Joi.string().length(11).required(),
  description: Joi.string().required(),
});

export const rechargeSchema = Joi.object<Recharge>({
  phone_id: Joi.number().required(),
  value: Joi.number().min(10).max(1000).required(),
});