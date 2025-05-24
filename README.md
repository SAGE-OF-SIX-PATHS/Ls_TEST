<h1 align="center">A bank account API for Modelling user accounts, Virtual cards, encryption and Decryption of sensitive data</h1>

<h2 align="center"> 🔐 This is my backend standardization test in genesys Techub Enugu (Encrypted Account Service API) </h2>

This API provides functionality for securely testing and handling sensitive account data such as card numbers, CVVs, phone numbers, and dates of birth using AES encryption. It allows:

##  The Core Features of this web service are: 
- 🔄 Encryption of sensitive fields before storing them
- 🧾 Fetching all accounts with decrypted data
- 🔓 Decrypting any provided encrypted input via a secure endpoint

---

## 📁 Folder Structure

```

src/
├── config/
│   └── db.ts
├── controllers/
│   └── account.controller.ts
│   └── decryption.controller.ts
├── models/
│   └── BankAccount.ts
│   └── VirtualCard.ts
├── routes/
│   └── accountRoutes.ts
│   └── decryptionRoutes.ts
├── services/
│   └── account.services.ts
│   └── encryption.service.ts
├── utils/
│   └── encryptor.util.ts
│   └── generateAccountNumber.ts

````

---

## 🛠️ How to use

- clone repo
```git clone https://github.com/SAGE-OF-SIX-PATHS/Ls_TEST.git```
- install all dependencies
```npm i```
- Build and create output dist
```npm run build```
- start server on Port 5000
```npm run dev```
- `crypto` module for AES encryption/decryption
```npm install crypto```
```npm install crypto-js @types/crypto-js --save```

---

## 🛠️ Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- `crypto` module for AES encryption/decryption

---

## 🔐 Encryption Service

All sensitive user fields are encrypted before being stored in the database using AES encryption.

### Encrypted Fields:
- `cardNumber`
- `cvv`
- `expiryDate`
- `phoneNumber`
- `dateOfBirth`

Encryption ensures that even if database access is compromised, sensitive data remains unreadable.

---

## 🧾 Endpoints

### Base URL: 
```ts 
https://ls-test-064b.onrender.com
```

### Published PostMan API documentation: 
```ts 
https://documenter.getpostman.com/view/42958692/2sB2qcBLLx
```

### Link to the PostMan API Documentation: 
```ts 
https://www.postman.com/payload-cosmonaut-74889724/workspace/bank-account-api/collection/42958692-0ce456f1-8a88-4ae7-979a-a39916a96fda?action=share&creator=42958692
```

### ✅ 1. `GET /api/createBankAccount`
Instantly create user bank account and authomatically generates a virtual card with 3 fields: card number, cvv, expiry date (3 years from date of creation).

### ✅ 2. `GET /api/getAccounts`

Returns all accounts from the database, with each encrypted field **securely decrypted** before being returned FOR TESTING PURPOSES.

### 🔓 3. `POST /api/decrypt`

Accepts encrypted data (ivHex) and returns the decrypted version:

---

## 💡 Design Philosophy

> "Let every record echo through the hash, yet stay guarded."

* Every encryption is consistent and reversible with the correct key and IV.
* The system ensures data integrity while shielding sensitive data from unauthorized access.

---

## 🧪 Sample Usage

```ts
import { encryptFields, decryptFields } from './services/encryption.service';

const encrypted = encryptFields({
  cardNumber: '1234567890123456',
  cvv: '123',
  expiryDate: '12/25',
  phoneNumber: '+2348012345678',
  dateOfBirth: '1990-05-22'
});

const decrypted = decryptFields({
  cardNumberEncrypted: encrypted.card.encryptedData,
  cardIV: encrypted.card.iv,
  cvvEncrypted: encrypted.cvv.encryptedData,
  cvvIV: encrypted.cvv.iv,
  expiryEncrypted: encrypted.expiry.encryptedData,
  expiryIV: encrypted.expiry.iv,
  phoneEncrypted: encrypted.phone.encryptedData,
  phoneIV: encrypted.phone.iv,
  dobEncrypted: encrypted.dob.encryptedData,
  dobIV: encrypted.dob.iv
});
```

---

## 🔒 Security Warning

This app handles **sensitive data**. Always:

* Use environment variables for your encryption key.
* Protect decryption endpoints with authentication in production.
* Never log raw decrypted values in a real production system.

---

## 👨‍💻 Author

**Nzubechukwu Akpamgbo** — I am very Passionate about building secure and efficient systems.

---

## 📄 License

genesys Techhub & learnable

```

Let me know if you’d like a badge-styled header, setup instructions, or integration with Swagger or Postman documentation.
```
