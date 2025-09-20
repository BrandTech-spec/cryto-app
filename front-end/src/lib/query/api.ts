import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SignInData, SignUpData, Transaction } from '../appwrite/appWriteConfig';
import { createNotification, createTransaction, getAllUser, getCurrentUser, getLastNotification, getLastTransaction, getSpecialData, getUserNofication, getUserTransactions, signIn, signOut, signUp, updateSpecialData, updateUser } from '../appwrite/api';

// Query keys
export const QUERY_KEYS = {
  currentUser: 'currentUser',
  lastTransaction: 'lastTransaction',
  userTransactions: 'userTransactions',
} as const;

// Authentication hooks
export const useSignUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: SignUpData) => signUp(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentUser] });
    },
    onError: (error) => {
      console.error('Sign up error:', error);
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: SignInData) => signIn(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentUser] });
    },
    onError: (error) => {
      console.error('Sign in error:', error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: {userId:string, payload:any}) => updateUser(userData),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error('Sign out error:', error);
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error('Sign out error:', error);
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetAllUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.currentUser],
    queryFn: getAllUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Transaction hooks
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => 
      createTransaction(transactionData),
    onSuccess: () => {
      // Invalidate current user data and transaction data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentUser] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lastTransaction] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userTransactions] });
    },
    onError: (error) => {
      console.error('Create transaction error:', error);
    },
  });
};

export const useLastTransaction = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lastTransaction, userId],
    queryFn: () => getLastTransaction(userId!),
    enabled: !!userId, // Only run if userId exists
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

export const useUserTransactions = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.userTransactions, userId],
    queryFn: () => getUserTransactions(userId!),
    enabled: !!userId, // Only run if userId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};


// Notification hooks
export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transactionData:  {
      user_id: string;
      body: string;
      type: string;
      amount: string;
      withdrawal_wallet: string;
      sentAt: number;
    }) => 
      createNotification(transactionData),
    onSuccess: () => {
      // Invalidate current user data and transaction data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.currentUser] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.lastTransaction] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userTransactions] });
    },
    onError: (error) => {
      console.error('Create transaction error:', error);
    },
  });
};

export const useLastNotification = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.lastTransaction, userId],
    queryFn: () => getLastNotification(userId!),
    enabled: !!userId, // Only run if userId exists
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

export const useUserNotifications = (userId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.userTransactions, userId],
    queryFn: () => getUserNofication(userId!),
    enabled: !!userId, // Only run if userId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};


// Notification hooks
export const useUpdateSpecialData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: {dataId:string, payload:any}) => updateSpecialData(userData),
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error('Sign out error:', error);
    },
  });
};

export const useGetSpecialData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.lastTransaction],
    queryFn: () => getSpecialData(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

