import { Request, Response } from 'express';
import db from '../database/database_connection';
import { Carrier, ParamsWithDocument, Phone, PhoneWithCarrier, Recharge, SummaryResponse } from '../protocols';

export const addPhone = async (req: Request, res: Response): Promise<void> => {
  const { number, carrier_id, description, cpf }: Phone = req.body;

  try {

    const cpfPhonesCount = await db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM phones WHERE cpf = $1',
      [cpf]
    );

    if (cpfPhonesCount.rows[0].count >= 3) {
      res.status(409).json({ error: 'This CPF has already reached the limit of 3 phone numbers' });
      return;
    }

    const result = await db.query<Phone>('SELECT * FROM phones WHERE number = $1', [number]);

    if (result && typeof result.rowCount === 'number' && result.rowCount > 0) {
      res.status(409).json({ error: 'Phone number already exists' });
      return
    }

    const insertResult = await db.query<Phone>(
      'INSERT INTO phones (number, carrier_id, description, cpf) VALUES ($1, $2, $3, $4) RETURNING *',
      [number, carrier_id, description, cpf]
    );

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Error inserting phone' });
  }
};
export const listPhones = async (req: Request<ParamsWithDocument>, res: Response): Promise<void> => {
  const { document } = req.params

  try {
    const result = await db.query<PhoneWithCarrier>(
      `SELECT phones.*, carriers.name AS carrier_name, carriers.code AS carrier_code 
       FROM phones 
       JOIN carriers ON carriers.id = phones.carrier_id 
       WHERE phones.cpf = $1`,
      [document]
    );

    if (result.rowCount === 0) {
    res.status(200).json([]);
    return
}


    res.status(200).send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving phones' });
  }
};

export const addRecharge = async (req: Request, res: Response): Promise<void> => {
  const { phone_id, value }: { phone_id: number; value: number } = req.body;

  try {
    const result = await db.query<Phone>('SELECT * FROM phones WHERE id = $1', [phone_id]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Phone not found' });
      return
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
    const result = await db.query<Recharge>(
      `SELECT recharges.* 
       FROM recharges 
       JOIN phones ON phones.id = recharges.phone_id 
       WHERE phones.number = $1`,
      [number]
    );

    res.json(result.rows.length > 0 ? result.rows : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving recharges' });
  }
};
export const getSummary = async (req: Request<ParamsWithDocument>, res: Response): Promise<void> => {
  const { document } = req.params;

  try {
    const result = await db.query<Phone & Carrier & Recharge & PhoneWithCarrier>(
      `SELECT phones.id, 
       phones.number, 
       phones.cpf, 
       carriers.id AS carrier_id, 
       carriers.name AS carrier_name, 
       carriers.code AS carrier_code, 
       recharges.id AS recharge_id, 
       recharges.value, 
       recharges.recharge_date
        FROM phones
        JOIN carriers ON carriers.id = phones.carrier_id
        LEFT JOIN recharges ON recharges.phone_id = phones.id
        WHERE phones.cpf = $1`, [document]
    );

    const phonesMap: Record<number, SummaryResponse['phones'][0]> = {};

    result.rows.forEach(row => {
      if (!phonesMap[row.id]) {
        phonesMap[row.id] = {
          id: row.id,
          number: row.number,
          cpf: row.cpf,
          carrier: {
            id: row.carrier_id,
            name: row.carrier_name,
            code: row.carrier_code,
          },
          recharges: [],
        };
      }

      if (row.id) {
        phonesMap[row.id].recharges.push({
          id: row.id,
          value: Number(row.value),
          recharge_date: new Date(row.recharge_date),
        });
      }
    });

    const summary: SummaryResponse = {
      document,
      phones: Object.values(phonesMap),
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving summary' });
  }
};
