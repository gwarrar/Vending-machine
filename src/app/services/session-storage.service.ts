import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  public getItem(itemkey: string): any{
    return JSON.parse(sessionStorage.getItem(itemkey))
  }

  public createItem(itemkey: string, itemValue: any){
    sessionStorage.setItem(itemkey, JSON.stringify(itemValue));
  }

  public updateItem(itemkey: string, itemValue: any){
    sessionStorage.setItem(itemkey, JSON.stringify(itemValue));
  }

  public deleteItem(itemkey: string){
    sessionStorage.removeItem(itemkey);
  }

  public deleteAll(){
    sessionStorage.clear();
  }

}
