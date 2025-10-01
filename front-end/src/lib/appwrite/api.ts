import { Query } from "appwrite";
import { account, COLLECTION_ID_SPECIAL_DATA, DATABASE_ID, databases, HISTORY_COLLECTION_ID, ID, NOTIFICATION_COLLECTION_ID, SignInData, SignUpData, Transaction, TRANSACTIONS_COLLECTION_ID, User, USERS_COLLECTION_ID } from "./appWriteConfig";
import { NOTFOUND } from "dns/promises";

// Authentication functions
export const signUp = async (userData: SignUpData) => {
  try {
    // Create account
    const newAccount = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.username
    );

    // Create user document
    const userDocument = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        user_name: userData.username,
        password:userData.password,
        email: userData.email,
        available_balance: 0,
        profite: 0,
        phone:userData.phone,
        address:userData.address,
        passcode: userData.referal_code,
        user_id: newAccount.$id,
        image_url: null,
      }
    );

    return { account: newAccount, user: userDocument };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const updateUser = async (userData: {userId:string, payload:any}) => {
  try {
  
     const {userId, payload} = userData
    // Create user document
    const userDocument = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      payload
      
    );

    return userDocument;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};


export const signIn = async (userData: SignInData) => {
  try {
    const session = await account.createEmailPasswordSession(userData.email, userData.password);
    return session;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
   const del =  await account.deleteSession('current');

   return del
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt')
      ]
    );

    return transactions.documents
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};

export const getCurrentUserById = async (userId:string) => {
  try {
    
    
    // Get user document by user_id
    const userDocuments = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );

    if (userDocuments.documents.length === 0) {
      throw new Error('User document not found');
    }

    const userDocument = userDocuments.documents[0];
    
    return {
      id: userDocument.$id,
      user_name: userDocument.user_name,
      email: userDocument.email,
      available_balance: userDocument.available_balance,
      profite: userDocument.profite,
      passcode: userDocument.passcode,
      user_id: userDocument.user_id,
      image_url: userDocument.image_url,
      $createdAt: userDocument.$createdAt,
      $updatedAt: userDocument.$updatedAt,
    } 
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    
    // Get user document by user_id
    const userDocuments = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('user_id', currentAccount.$id)]
    );

    if (userDocuments.documents.length === 0) {
      throw new Error('User document not found');
    }

    const userDocument = userDocuments.documents[0];
    
    return {
      id: userDocument.$id,
      user_name: userDocument.user_name,
      email: userDocument.email,
      available_balance: userDocument.available_balance,
      profite: userDocument.profite,
      passcode: userDocument.passcode,
      user_id: userDocument.user_id,
      image_url: userDocument.image_url,
      $createdAt: userDocument.$createdAt,
      $updatedAt: userDocument.$updatedAt,
    } 
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Transaction functions
export const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const transaction = await databases.createDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      ID.unique(),
      transactionData
    );

    return {
      user_id: transaction.user_id,
      amount: transaction.amount,
      currency: transaction.currency,
      time: transaction.time,
      type: transaction.type,
      profite: transaction.profite,
      current_state: transaction.current_state,
      createdAt: transaction.$createdAt,
      updatedAt: transaction.$updatedAt,
    } as Transaction;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

export const getLastTransaction = async (userId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (transactions.documents.length === 0) {
      return null;
    }

    const transaction = transactions.documents[0];
    
    return transaction
  } catch (error) {
    console.error('Get last transaction error:', error);
    throw error;
  }
};

export const getUserTransactions = async (userId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt')
      ]
    );

    return transactions.documents.map(transaction => ({
      id: transaction.$id,
      user_id: transaction.user_id,
      amount: transaction.amount,
      currency: transaction.currency,
      time: transaction.time,
      type: transaction.type,
      profite: transaction.profite,
      current_state: transaction.current_state,
      createdAt: transaction.$createdAt,
      updatedAt: transaction.$updatedAt,
    })) as Transaction[];
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};

export const updateUserTransactions = async (payload: {tradeId:string, data:any}) => {
  const {tradeId, data} = payload
  try {
    const transactions = await databases.updateDocument(
      DATABASE_ID,
      TRANSACTIONS_COLLECTION_ID,
      tradeId,
      data
    );

    return transactions
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};
// Notification functions
export const createNotification = async (transactionData:  {
  user_id: string;
  body: string;
  type: string;
  amount: string;
  withdrawal_wallet: string;
  sentAt: number;
}) => {
  try {
    const transaction = await databases.createDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      ID.unique(),
      transactionData
    );

    return transaction
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

export const getLastNotification = async (userId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.equal('type', "withdraw"),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (transactions.documents.length === 0) {
      return null;
    }

    const transaction = transactions.documents[0];
    
    return transaction ;
  } catch (error) {
    console.error('Get last transaction error:', error);
    throw error;
  }
};

export const getUserNofication = async (userId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt')
      ]
    );

    return transactions.documents
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};

export const updateUserNofication = async (payload: {notId:string, data:any}) => {
  const {notId, data} = payload
  try {
    const transactions = await databases.updateDocument(
      DATABASE_ID,
      NOTIFICATION_COLLECTION_ID,
      notId,
      data
    );

    return transactions
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};


export const getUserHistory = async (userId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt')
      ]
    );

    return transactions.documents
  } catch (error) {
    console.error('Get user transactions error:', error);
    throw error;
  }
};


/// special data

export const updateSpecialData = async (userData: {dataId:string, payload:any}) => {
  try {
  
     const {dataId, payload} = userData
    // Create user document
    const userDocument = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID_SPECIAL_DATA,
      dataId,
      payload
      
    );

    return userDocument;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const getSpecialData = async () => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_SPECIAL_DATA,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (transactions.documents.length === 0) {
      return null;
    }

    const transaction = transactions.documents[0];
    
    return transaction ;
  } catch (error) {
    console.error('Get last transaction error:', error);
    throw error;
  }
};

// history
export const getHistoryById = async (tradeId: string) => {
  try {
    const transactions = await databases.listDocuments(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      [
        Query.equal('trade_id', tradeId),
        Query.orderDesc('$createdAt'),
        Query.limit(1)
      ]
    );

    if (transactions.documents.length === 0) {
      return null;
    }

    const transaction = transactions.documents[0];
    
    return transaction
  } catch (error) {
    console.error('Get last transaction error:', error);
    throw error;
  }
};

export const createHistory = async (transactionData:   {
  trade_id: string;
  open_price: number;
  close_price: number;
  profit: number;
  amount: number;
  type: number;
}) => {
  try {
    const transaction = await databases.createDocument(
      DATABASE_ID,
      HISTORY_COLLECTION_ID,
      ID.unique(),
      transactionData
    );

    return transaction
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};