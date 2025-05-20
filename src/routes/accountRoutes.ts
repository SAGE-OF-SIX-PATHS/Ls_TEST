import { Router } from 'express';
import { createAccount } from '../controllers/accountController';

const router = Router();

router.post('/createBankAccount', createAccount);

export default router;