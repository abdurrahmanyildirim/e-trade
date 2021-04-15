import { StorageKey } from '../../../models/storage';

export abstract class BaseStorageService {
  constructor(private storage: Storage) {}

  getObject<T>(key: StorageKey): T {
    return JSON.parse(this.storage.getItem(key)) as T;
  }

  setObject(key: StorageKey, object: any): void {
    this.storage.setItem(key, JSON.stringify(object));
  }

  setItem(key: StorageKey, data: string): void {
    this.storage.setItem(key, data);
  }

  getItem(key: StorageKey): string {
    return this.storage.getItem(key);
  }

  removeItem(key: StorageKey): void {
    this.storage.removeItem(key);
  }
}
