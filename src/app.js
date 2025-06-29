import express from 'express';


const app = express();

// NOTE: import rutas
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js'; 
import tasksRoutes from './routes/task.routes.js';
import morgan from 'morgan';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import { authenticateToken } from './middlewares/authenticate.js';


//midleware
app.use(morgan('dev'))
app.use(express.json());

// routes
app.use('/api/login', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);

app.use(notFound);
app.use(errorHandler);

export default app