import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import {
  APP_INIT,
  GET_ITEM,
  REMOVE_ITEM,
  SET_ITEM,
} from '../storage/storage.service';

export const SETTINGS_STORAGE = 'settings';

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  private onSubject = new BehaviorSubject<{ event: string; value: any }>({
    event: APP_INIT,
    value: true,
  });
  public changes = this.onSubject.asObservable().pipe(share());

  getSharedPref() {
    return (window as any).plugins.SharedPreferences.getInstance(
      SETTINGS_STORAGE,
    );
  }

  async getItem(key: string) {
    return new Promise((resolve, reject) => {
      this.getSharedPref().get(
        key,
        null,
        value => {
          this.onSubject.next({ event: GET_ITEM, value });
          resolve(value);
        },
        error => reject(error),
      );
    });
  }

  async removeItem(key: string) {
    return new Promise((resolve, reject) => {
      this.getSharedPref().del(
        key,
        success => {
          this.onSubject.next({ event: REMOVE_ITEM, value: key });
          resolve(success);
        },
        error => reject(error),
      );
    });
  }

  async setItem(key: string, value: string) {
    return new Promise((resolve, reject) => {
      this.getSharedPref().put(
        key,
        value,
        success => {
          this.onSubject.next({ event: SET_ITEM, value: { key, value } });
          resolve(success);
        },
        error => reject(error),
      );
    });
  }
}
