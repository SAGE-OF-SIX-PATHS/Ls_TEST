import { Request, Response } from 'express';
import { decryptFields, EncryptedInput } from '../services/encryption.service';

export const decryptAccountData = async (req: Request, res: Response): Promise<void> => {
  try {
    const encryptedData: EncryptedInput = req.body;

    console.log('\n🔐 [decryptAccountData] Received encrypted data:', encryptedData);

    const decrypted = decryptFields(encryptedData);

    console.log('✅ [decryptAccountData] Decryption complete:', decrypted);

     res.status(200).json({
      success: true,
      decrypted,
    });
  } catch (error) {
    console.error('❌ [decryptAccountData] Error during decryption:', error);
     res.status(500).json({
      success: false,
      message: 'Failed to decrypt the provided data.',
      error: error instanceof Error ? error.message : error,
    });
  }
};
