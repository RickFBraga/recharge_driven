import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/validations';

dotenv.config();

const app = express();
app.use(express.json());

app.use(router)

app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200).send('Health endpoint is working!');
});

app.use(errorHandler);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
