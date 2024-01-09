import express from 'express';
import dotenv from 'dotenv'
import router from './router'

dotenv.config({path: 'config/.env'})


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;


app.use('/api', router())


app.listen(process.env.PORT, () => {
    console.log(`server runnig on ${process.env.PORT}`)
})