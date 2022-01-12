import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class LocalStoreManager {


  private initEvent = new Subject();

  public initialiseStorageSyncListener() {
    window.addEventListener('storage', this.sessionStorageTransferHandler, false);
    this.syncSessionStorage();
  }

  private syncSessionStorage() {
    localStorage.setItem('getSessionStorage', '_dummy');
    localStorage.removeItem('getSessionStorage');
  }

  private sessionStorageTransferHandler = (event: StorageEvent) => {
    if (event.key === 'getSessionStorage') {
      if (sessionStorage.length) {
        this.localStorageSetItem('setSessionStorage', sessionStorage);
        localStorage.removeItem('setSessionStorage');
      }
    }
    if (event.key === 'setSessionStorage') {
      this.onInit();
    }

  }

  private onInit() {
    setTimeout(() => {
      this.initEvent.next();
      this.initEvent.complete();
    });
  }

  private localStorageSetItem(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getInitEvent(): Observable<{}> {
    return this.initEvent.asObservable();
  }


}
