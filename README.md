# 🩺 HealthPlus – Decentralized Medical Record Management

Satnam Shri Waheguru Ji 🙏

HealthPlus is a **Web3-based decentralized healthcare records system** built using **Solana blockchain**, **IPFS (via Pinata)**, **Next.js**, and **React**. It offers **secure, patient-controlled medical data sharing** between patients and healthcare providers while complying with privacy regulations like **GDPR/HIPAA**.

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Blockchain:** Solana (smart contracts via Anchor)
- **Storage:** IPFS (Pinata pinning service)
- **Encryption:** AES-256 client-side + ECDSA key wrapping
- **Wallets:** Phantom, Solflare, Solana Wallet Adapter
- **Backend Services:** Node.js APIs (JWT auth, NHS integration, notifications)
- **Messaging:** End-to-end encrypted messaging using Solana keypairs
- **NHS API Integration:** Health alerts, vaccination campaigns, etc.

---

## 🎯 Problem Statement

Traditional health systems often suffer from:
- Centralized and breach-prone storage
- Poor data sharing control
- No patient-side ownership of data
- Compliance issues (GDPR/HIPAA)

**HealthPlus solves this by decentralizing health records** using blockchain and IPFS, while giving complete control to the patient and ensuring privacy via cryptographic protection.

---

## 👨‍⚕️👩‍⚕️ Core Features

### 🔐 1. **Secure Medical Record Storage**

- Client-side AES-256 encryption of files before upload
- IPFS (via Pinata) for decentralized file storage
- Solana smart contract stores:
  - IPFS hash (CID)
  - Metadata (file name, MIME type, timestamp)
  - Wrapped encryption keys for each authorized viewer (doctor/patient)

---

### 👨‍⚕️ 2. **Doctor Dashboard**

- 📅 **Appointment Management**  
  Dual calendar view (home visit & clinic) with drag-and-drop rescheduling and automated reminders

- 💬 **Secure Messaging**  
  E2E encrypted doctor-patient messaging with attachments (reports, images)

- 📄 **Report Uploading**  
  Drag-and-drop UI → auto encryption → upload to IPFS → store CID on-chain → grant access to patient wallet

- 🔔 **Real-Time Notifications**  
  WebSocket & push notifications for new messages, bookings, or report access

---

### 👩‍⚕️ 3. **Patient Dashboard**

- 📰 **NHS Health Updates**  
  Regional updates and alerts (flu outbreaks, vaccinations)

- 📆 **Book Appointments**  
  Choose between home or clinic visit, view doctor's availability, smart suggestions

- 🗂️ **Encrypted Report Viewer**  
  Decrypt and view PDF/image files in-browser using Solana private key

- 💬 **Secure Messaging**  
  Chat with doctor or clinic staff with encrypted media sharing

- 📍 **Appointment Tracking**  
  View upcoming/past appointments with status (pending, confirmed, completed), integrated with Google Maps

---

### 🔐 4. **Blockchain Access Control**

- Smart contract access entries per file
- `grantAccess` and `revokeAccess` functions to manage who can decrypt
- Immutable audit logs for every action: share, view, revoke

---

### 👛 5. **Wallet & Auth**

- Solana Wallet Adapter integration (Phantom, Solflare)
- Optional JWT auth for backend APIs after wallet signature
- Batching of transactions to reduce gas and latency

---

### ✅ 6. **Compliance & Security**

- GDPR-compliant “right to be forgotten” → revoke all keys, make data unreadable
- HIPAA-ready encryption and logging policies
- Full audit trail (on-chain + optional off-chain log mirrors)
- Pen-tested, audited smart contracts with bug bounty system

---

### 🎨 7. **UI/UX Excellence**

- **Next.js SSR + SPA Hydration**: Fast, responsive UI
- **Role-based themes**: Calm UI for doctors, accessible UI for patients
- **Animations**: Framer Motion transitions
- **Accessibility**: Full keyboard navigation, screen reader support
- **User Feedback**: Toasts, skeleton loaders, modals

---

## 🛠️ Developer Setup

```bash
git clone https://github.com/your-org/healthplus.git
cd healthplus

# Install dependencies
npm install

# Start development server
npm run dev
