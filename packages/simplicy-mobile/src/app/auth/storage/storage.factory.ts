import { StorageService } from './storage.service';

export function storageFactory(store: StorageService) {
  return () => store.init();
}
