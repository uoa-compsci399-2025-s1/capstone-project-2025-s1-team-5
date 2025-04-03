import express from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './mongodb';

dotenv.config();
const app = express();
app.use(express.json());

import adminRouter from './routes/admin_routes';
import userRouter from './routes/user_routes';
import authenticationRouter from './routes/authenticaiton.routes';

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter)
app.use('/api/authentication', authenticationRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
//   await  connectToDatabase()
});