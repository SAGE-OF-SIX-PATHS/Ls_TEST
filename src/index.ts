import dotenv from 'dotenv';
import connectDB from './config/db';
import express from 'express';
import accountRoutes from './routes/accountRoutes';
import decryptionRoutes from './routes/decryptionRoutes';

dotenv.config();

const app = express();

app.use(express.json());


app.use(express.json());
app.use('/api', accountRoutes); // endpoint: /handle accounts fetch and post task
app.use('/api', decryptionRoutes); // endpoint: /decrypt for decryption task
app.get('/', (req, res) => {
          res.send('Welcome to the Decryption API');
})

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
          app.listen(PORT, () => {
                    console.log(`✅ Server running on http://localhost:${PORT}`);
          });
});
//NB: I used enough console.log statements in each module with control flow structures to track the flow of data and errors.