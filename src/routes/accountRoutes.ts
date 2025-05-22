import { Router } from 'express';
import { createAccount } from '../controllers/accountController';
import { getAllAccounts } from '../controllers/accountController';

const router = Router();

router.post('/createBankAccount', createAccount);
router.get('/getaccounts', getAllAccounts);

export default router;