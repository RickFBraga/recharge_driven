import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/validations';

dotenv.config();

const app = express();
app.use(express.json());

app.use(router)

app.get('/health', (req, res) => {
    res.sendStatus(200);
});

app.use((err, res,) => {
    console.error(err);
    res.status(500).send('Algo deu errado!');
});

app.use(errorHandler);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
