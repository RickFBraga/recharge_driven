import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
