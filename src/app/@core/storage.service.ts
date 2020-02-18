import { Injectable } from '@angular/core';

import { C } from '../@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: any;

  constructor() {
    this.storage = localStorage;
  }

  /**
   * Use for storing values, stringifies values
   */
  public set(key: string, value: any): void {
    switch (typeof value) {
      case 'function':
        throw new Error('Yeah, so, functions cannot be saved into localStorage.');
      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
        this.storage.setItem(C.STORAGE_PREFIX + key, value || '');
        break;
      default:
        this.storage.setItem(C.STORAGE_PREFIX + key, JSON.stringify(value));
        break;
    }
  }

  public get(key: string, defaultValue?: any): any {
    let item = this.storage.getItem(C.STORAGE_PREFIX + key) || defaultValue;

    // We do not need to parse the default value
    if (item !== defaultValue) {
      item = this.parseJsonIfNeeded(item);
    }

    return item;
  }

  public remove(key: string): void {
    this.storage.removeItem(C.STORAGE_PREFIX + key);
  }

  public clear(): void {
    for (const item in this.storage) {
      if (!this.storage.hasOwnProperty(item)) { continue };

      // eslint-disable-next-line @typescript-eslint/prefer-includes
      if (item.indexOf(C.STORAGE_PREFIX) >= 0) {
        this.storage.removeItem(item);
      }
    }
  }

  public getAllItems(): any {
    const items = Object.assign({}, this.storage);

    for (const item in items) {
      if (!items.hasOwnProperty(item)) { continue };

      items[item] = this.parseJsonIfNeeded(items[item]);

      // eslint-disable-next-line @typescript-eslint/prefer-includes
      if (item.indexOf(C.STORAGE_PREFIX) < 0) {
        delete items[item];
      }
    }

    return items;
  }

  private parseJsonIfNeeded(item: any): any {
    // console.log(item);
    try {
      item = JSON.parse(item || '{}'); // TODO Why an empty object, does that make sense?
    } catch (e) {
      // Item is probably a string like 'Hello world' which cannot be parsed,
      // no hard feelings, just don't let the app crash
    }

    return item;
  }
}
