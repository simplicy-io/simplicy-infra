import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

export const DB_NAME = 'app_data';
export const APP_INIT = 'app_init';
export const PUT_DOC = 'put_doc';
export const GET_DOC = 'get_doc';
export const GET_ITEM = 'get_item';
export const REMOVE_ITEM = 'remove_item';
export const SET_ITEM = 'set_item';
export const SETTINGS_ID = 'settings_id';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  db = localStorage;
  private onSubject = new BehaviorSubject<{ event: string; value: any }>({
    event: APP_INIT,
    value: true,
  });
  public changes = this.onSubject.asObservable().pipe(share());

  constructor() {}

  init() {}

  getItem(key: string) {
    const value = this.db.getItem(key);
    this.onSubject.next({ event: GET_ITEM, value });
    return value;
  }

  removeItem(key: string) {
    this.onSubject.next({ event: REMOVE_ITEM, value: key });
    return this.db.removeItem(key);
  }

  setItem(key: string, value: string) {
    this.onSubject.next({ event: SET_ITEM, value: { key, value } });
    return this.db.setItem(key, value);
  }
}
