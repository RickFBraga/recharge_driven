import { Request, Response } from 'express';
import db from '../database/database_connection';
import { Carrier, ParamsWithDocument, Phone, Recharge } from '../protocols';

export const addCustomer = async (req: Request, res: Response): Promise<void> => {
  const { name, document } = req.body;

  try {
    const insertResult = await db.query(
      'INSERT INTO customers (name, document) VALUES ($1, $2) RETURNING *',
      [name, document]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting customer' });
  }
};

export const addPhone = async (req: Request, res: Response): Promise<void> => {
  const { number, carrier_id, customer_id }: Phone = req.body;
   try {
    const customerCheck = await db.query('SELECT * FROM customers WHERE id = $1', [customer_id]);
    if (customerCheck.rowCount === 0) {
       res.status(404).json({ error: 'Customer not found' });
    }

    const result = await db.query('SELECT * FROM phones WHERE number = $1', [number]);
    if (typeof result.rowCount === 'number' && result.rowCount > 0) {
       res.status(409).json({ error: 'Phone number already exists' });
    }

    const insertResult = await db.query(
      'INSERT INTO phones (number, carrier_id, customer_id) VALUES ($1, $2, $3) RETURNING *',
      [number, carrier_id, customer_id]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting phone' });
  }
};
export const listPhones = async (req: Request<ParamsWithDocument>, res: Response): Promise<void> => {
  const { document } = req.params;

  try {
    const result = await db.query<Phone & Carrier>('SELECT phones.*, carriers.name AS carrier_name, carriers.code AS carrier_code FROM phones JOIN customers ON customers.id = phones.customer_id JOIN carriers ON carriers.id = phones.carrier_id WHERE customers.document = $1', [document]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving phones' });
  }
};

export const addRecharge = async (req: Request, res: Response): Promise<void> => {
  const { phone_id, value }: { phone_id: number; value: number } = req.body;

  try {
    const result = await db.query<Phone>('SELECT * FROM phones WHERE id = $1', [phone_id]);

    if (result && result.rowCount === 0) {
      res.status(404).json({ error: 'Phone not found' });
      return;
    }

    const insertResult = await db.query<Recharge>(
      'INSERT INTO recharges (phone_id, value) VALUES ($1, $2) RETURNING *',
      [phone_id, value]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting recharge' });
  }
};

export const listRecharges = async (req: Request<{ number: string }>, res: Response): Promise<void> => {
  const { number } = req.params;

  try {
    const result = await db.query<Recharge>('SELECT recharges.* FROM recharges JOIN phones ON phones.id = recharges.phone_id WHERE phones.number = $1', [number]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving recharges' });
  }
};

export const getSummary = async (req: Request<ParamsWithDocument>, res: Response): Promise<void> => {
  const { document } = req.params;

  try {
    const result = await db.query<Phone & Carrier & Recharge>(
      `SELECT phones.*, carriers.*, recharges.*
       FROM phones
       JOIN customers ON customers.id = phones.customer_id
       JOIN carriers ON carriers.id = phones.carrier_id
       LEFT JOIN recharges ON recharges.phone_id = phones.id
       WHERE customers.document = $1`, [document]
    );

    res.json({ document, phones: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving summary' });
  }
};
