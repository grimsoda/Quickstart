import type { StorageSnapshot } from "@quickstart/storage";

export const applySnapshot = (
  snapshot: StorageSnapshot,
  next: StorageSnapshot,
  persist: (nextState: StorageSnapshot) => void,
) => {
  persist({ ...snapshot, ...next });
};
