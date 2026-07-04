import { useState, type Dispatch, type SetStateAction } from "react";

export function useSyncedState<T>(
  value: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(value);
  const [prev, setPrev] = useState(value);

  if (!Object.is(value, prev)) {
    setPrev(value);
    setState(value);
  }

  return [state, setState];
}
