import express from 'express';
import routes from './routes';
import path from 'path';
import './database';

const app = express();

app.use(express.json());
app.use('/users', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(routes);


app.listen(3000, () => {
    console.log('Server is running!');
});