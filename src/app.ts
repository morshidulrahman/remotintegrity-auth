/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import path from 'path';

const app: Application = express();

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://localhost:5000',
      'https://youri.vercel.app',
      'http://youri.vercel.app',
      'https://ri-tracker-frontend.vercel.app',
      'http://ri-tracker-frontend.vercel.app',
      'https://tracker.remoteintegrity.com',
      'http://tracker.remoteintegrity.com',
      'https://remoteintegrity.com',
      'http://erp.remoteintegrity.com',
      'http://erp.remoteintegrity.com:3000',
      'http://dev.gari.remoteintegrity.com',
      'https://dev.gari.remoteintegrity.com',
      'https://erp.remoteintegrity.com',
      'https://erp.remoteintegrity.com:3000',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};

// Parsers and Middleware
app.use(express.json());
app.use(cookieParser());
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(morgan('dev'));

// Serve static files from the 'images' directory
//app.use('/images', express.static(path.join(process.cwd(), 'images')));

// Application Routes
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'RemoteIntegrity Backend Server is running!',
  });
});

app.use(globalErrorHandler);
// Not Found
app.use(notFound);

export default app;
