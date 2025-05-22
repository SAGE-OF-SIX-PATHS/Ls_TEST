import dotenv from 'dotenv';
import connectDB from './config/db';
import express from 'express';
import accountRoutes from './routes/accountRoutes';

dotenv.config();

const app = express();

app.use(express.json());


app.use(express.json());
app.use('/api', accountRoutes); // endpoint: /handle accounts fetch and post task


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
          app.listen(PORT, () => {
                    console.log(`✅ Server running on http://localhost:${PORT}`);
          });
});
