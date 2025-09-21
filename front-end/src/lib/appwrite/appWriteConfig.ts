import { Client, Account, Databases } from 'appwrite';

// Types
export type User = {
  $id: string | null;
  user_name: string;
  password?: string | null;
  email: string;
  available_balance: number;
  profite: number;
  passcode?: string | null;
  user_id?: string | null;
  image_url?: string | null;
  $createdAt?: Date;
  $updatedAt?: Date;
};

export type Transaction = {
  $id?: string;
  user_id: string;
  amount: number;
  currency: string;
  time?: number | null;
  type: 'manual' | 'auto';
  profite: number;
  current_state: 'buy' | 'sell';
  $createdAt?: string | null;
  $updatedAt?: string | null;
};

export type Notification = {
  user_id: string; // Size 100, required
  body: string;    // Size 500, required
  type: string | null; // Optional (can be null)
  amount: number;  // Min: 0, default 0
  withdrawal_wallet: string | null; // Size 200, optional (can be null)
  sentAt: Date | null; // Optional (can be null)
  readAt: Date | null; // Optional (can be null)
  $createdAt: Date | null; // Optional (can be null, typically auto-generated)
  $updatedAt: Date | null; // Optional (can be null, typically auto-generated)
};


export type SignUpData = {
  email: string;
  password: string;
  username: string;
  passcode: string;
  referal_code: string
};

export type SignInData = {
  email: string;
  password: string;
};

// Appwrite configuration
export const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Environment variables
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;
export const TRANSACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID;
export const HISTORY_COLLECTION_ID = import.meta.env.VITE_APPWRITE_HISTORY_COLLECTION_ID;
export const NOTIFICATION_COLLECTION_ID = import.meta.env.VITE_APPWRITE_NOTIFICATION_COLLECTION_ID;
export const COLLECTION_ID_MESSAGES = import.meta.env.VITE_APPWRITE_MESSAGE_COLLECTION_ID;
export const COLLECTION_ID_SPECIAL_DATA = import.meta.env.VITE_APPWRITE_SPECIAL_DATA_COLLECTION_ID

export { ID } from 'appwrite';