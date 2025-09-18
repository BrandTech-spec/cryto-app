import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  created_at: string;
  balance?: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  created_at: string;
  updated_at: string;
  processed_by?: string;
  processed_at?: string;
  profiles?: {
    username: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalBalance: number;
  pendingTransactions: number;
  unreadMessages: number;
}

export const useAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalBalance: 0,
    pendingTransactions: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if user is admin
  const checkAdminStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
        return false;
      }

      const adminStatus = !!data;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, []);

  // Load all users with their balances
  const loadUsers = useCallback(async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Load balances separately
      const { data: balances, error: balancesError } = await supabase
        .from('user_balances')
        .select('user_id, balance');

      if (balancesError) throw balancesError;

      const balanceMap = new Map(balances?.map(b => [b.user_id, parseFloat(b.balance as unknown as string) || 0]) || []);

      const usersWithBalances = profiles?.map(profile => ({
        id: profile.id,
        username: profile.username,
        created_at: profile.created_at,
        balance: balanceMap.get(profile.id) || 0
      })) || [];

      setUsers(usersWithBalances);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      const { data: rawTransactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          user_id,
          type,
          amount,
          status,
          description,
          created_at,
          updated_at,
          processed_by,
          processed_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load profiles separately to avoid relation issues
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username');

      const profileMap = new Map(profiles?.map(p => [p.id, p.username]) || []);

      const typedTransactions: Transaction[] = (rawTransactions || []).map(transaction => ({
        ...transaction,
        type: transaction.type as 'deposit' | 'withdrawal',
        status: transaction.status as 'pending' | 'approved' | 'rejected',
        profiles: {
          username: profileMap.get(transaction.user_id) || 'Unknown User'
        }
      }));
      
      setTransactions(typedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load admin statistics
  const loadStats = useCallback(async () => {
    try {
      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total balance
      const { data: balances } = await supabase
        .from('user_balances')
        .select('balance');

      const totalBalance = balances?.reduce((sum, b) => sum + (parseFloat(b.balance as unknown as string) || 0), 0) || 0;

      // Get pending transactions count
      const { count: pendingTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get unread messages count (conversations with recent messages)
      const { data: recentMessages } = await supabase
        .from('messages')
        .select('conversation_id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const unreadMessages = new Set(recentMessages?.map(m => m.conversation_id)).size || 0;

      setStats({
        totalUsers: totalUsers || 0,
        totalBalance,
        pendingTransactions: pendingTransactions || 0,
        unreadMessages
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  // Update user balance
  const updateUserBalance = useCallback(async (userId: string, newBalance: number) => {
    try {
      const { error } = await supabase
        .from('user_balances')
        .update({ balance: newBalance as unknown as number })
        .eq('user_id', userId);

      if (error) throw error;

      // Reload users to get updated balance
      await loadUsers();
      
      toast({
        title: "Success",
        description: "User balance updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating balance:', error);
      toast({
        title: "Error",
        description: "Failed to update user balance",
        variant: "destructive",
      });
      return false;
    }
  }, [loadUsers, toast]);

  // Approve/reject transaction
  const processTransaction = useCallback(async (transactionId: string, status: 'approved' | 'rejected') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transactions')
        .update({
          status,
          processed_by: user.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      // If approved, update user balance
      if (status === 'approved') {
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction) {
          const currentUser = users.find(u => u.id === transaction.user_id);
          const currentBalance = currentUser?.balance || 0;
          
          let newBalance;
          if (transaction.type === 'deposit') {
            newBalance = currentBalance + transaction.amount;
          } else {
            newBalance = Math.max(0, currentBalance - transaction.amount);
          }

          await supabase
            .from('user_balances')
            .update({ balance: newBalance as unknown as number })
            .eq('user_id', transaction.user_id);
        }
      }

      await loadTransactions();
      await loadUsers();
      await loadStats();

      toast({
        title: "Success",
        description: `Transaction ${status} successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      });
      return false;
    }
  }, [transactions, users, loadTransactions, loadUsers, loadStats, toast]);

  // Initialize admin data
  useEffect(() => {
    const initializeAdmin = async () => {
      setLoading(true);
      const adminStatus = await checkAdminStatus();
      
      if (adminStatus) {
        await Promise.all([
          loadUsers(),
          loadTransactions(),
          loadStats()
        ]);
      }
      
      setLoading(false);
    };

    initializeAdmin();
  }, [checkAdminStatus, loadUsers, loadTransactions, loadStats]);

  // Set up real-time subscriptions for admin data
  useEffect(() => {
    if (!isAdmin) return;

    const transactionsChannel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions'
        },
        () => {
          loadTransactions();
          loadStats();
        }
      )
      .subscribe();

    const balancesChannel = supabase
      .channel('balances-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances'
        },
        () => {
          loadUsers();
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(balancesChannel);
    };
  }, [isAdmin, loadTransactions, loadUsers, loadStats]);

  return {
    users,
    transactions,
    stats,
    loading,
    isAdmin,
    updateUserBalance,
    processTransaction,
    refreshData: async () => {
      await Promise.all([loadUsers(), loadTransactions(), loadStats()]);
    }
  };
};