import { useEffect, useRef, useState } from 'react';

export const useDebouncedSearch = (
  searchFunc: (query: string) => Promise<unknown[]>,
  delay: number = 500
) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<unknown[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const requestRef = useRef<number>(0);

  useEffect(() => {
    if (query.trim() === '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      const currentRequest = ++requestRef.current;
      setLoading(true);
      try {
        const result = await searchFunc(query);

        if (currentRequest === requestRef.current) {
          setData(result);
          setError(null);
        }

        setLoading(false);
      } catch (error) {
        if (currentRequest === requestRef.current) {
          setData([]);
          setError(error);
        }
      } finally {
        if (currentRequest === requestRef.current) {
          setLoading(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, searchFunc, delay]);

  return {
    query,
    setQuery,
    loading,
    data,
    error,
  };
};
