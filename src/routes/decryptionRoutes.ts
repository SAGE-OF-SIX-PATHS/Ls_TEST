import express from 'express';
import { decryptAccountData } from '../controllers/decryption.controller';

const router = express.Router();

router.post('/decrypt', decryptAccountData);

export default router;
