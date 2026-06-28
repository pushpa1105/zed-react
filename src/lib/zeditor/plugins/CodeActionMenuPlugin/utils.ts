import { debounce } from "lodash-es";
import { useEffect, useMemo } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
  maxWait?: number,
) {
  const debounced = useMemo(
    () => debounce(fn, wait, { maxWait }),
    [fn, wait, maxWait],
  );

  useEffect(() => {
    return () => debounced.cancel();
  }, [debounced]);

  return debounced;
}