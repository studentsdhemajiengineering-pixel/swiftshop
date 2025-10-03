
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUsers as fetchUsers } from '@/lib/firebase/service';
import type { User } from '@/lib/types';
import { useToast } from './use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (e: any) {
      setError(e);
      // The service now handles emitting permission errors, so we don't toast here.
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, loading, error, refetch };
}
