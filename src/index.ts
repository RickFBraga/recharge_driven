import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/validations';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use(router)

app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('Health endpoint is working!');
    return
});

app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`)
});