import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import __dirname from './utils/index.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import aiRouter from './routes/ai.router.js'
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "API AdoptMe - Pets",
      version: "1.0.0",
      description: "Documentación de los endpoints"
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: [__dirname + "/docs/*.yaml"], 
};


const swaggerSpecs = swaggerJsdoc(swaggerOptions);
const app = express();
const PORT = process.env.PORT||8080;
const MONGO_URI = process.env.MONGO_URI;



app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/ai', aiRouter);



mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Conectado a MongoDB Atlas");
        app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
    })
    .catch(err => console.error("Error de conexión a Mongo:", err));

