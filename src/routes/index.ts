import express from 'express';
import { addPhone, addRecharge, getSummary, listPhones, listRecharges } from '../controllers';
import { validatePhone, validateRecharge } from '../middleware/validations';

export const router = express.Router();

router.post('/phones', validatePhone, addPhone);

router.get('/phones/:document', listPhones);

router.post('/recharges', validateRecharge, addRecharge);

router.get('/recharges/:number', listRecharges);

router.get('/summary/:document', getSummary);

export default router;
