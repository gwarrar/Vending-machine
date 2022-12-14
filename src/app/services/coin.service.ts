import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coin } from './../models/coin';
import { Coinslist } from './../models/coinslist';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private coins: Coin[] = [];
  private coinsCounter: Coinslist[] = [];

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) { }

  public getAll() {
    this.http.get<Coin[]>('./../../assets/mock/coins.json').subscribe(res => {
      this.coins = res;
      this.sessionStorageService.createItem('coins', this.coins);
    })
  }

  public updatCoin(coins: Coin[]) {
    this.updateIteminStorage('coins', coins)
  }

  public addCoin(coin: Coin) {
    let coins: Coin[] = this.getItemFromStorage('coins');
    coins.push(coin);
    // this.sessionStorageService.deleteItem('coins');
    this.updateIteminStorage('coins', coins);
  }

  public subtractLastCoin() {
    let coins: Coin[] = this.getItemFromStorage('coins');
    coins.pop();
    this.updateIteminStorage('coins', coins);
  }

  deleteCoinbyId(coin: Coin){
    let coins: Coin[] = this.getItemFromStorage('coins');
    coins.filter(item => item.id !== coin.id);
    this.sessionStorageService.updateItem('coins', coins);
  }

  // deleteCoinbyValue(coin: Coin){
  //   let coins: Coin[] = this.getItemFromStorage('coins');
  //   coins.filter(item => item.vlaue !== coin.vlaue);
  //   this.sessionStorageService.updateItem('coins', coins);
  // }

  public countCoins(coinCode: string, coinValue: number) {
    let coins: Coin[] = this.getItemFromStorage('coins');
    return coins.filter(coin => coin.code == coinCode && coin.vlaue == coinValue).length;
  }

  private coinCountCollect(code: string, value: number)
  {
    // let coinsCounter : Coinslist[];
    let newCoinCount: Coinslist = new Coinslist() ;
    newCoinCount.count = this.countCoins(code, value);
    newCoinCount.code = code;
    newCoinCount.value = value;
    this.coinsCounter.push(newCoinCount);

  }

  public  coinsCollector() {
    this.coinCountCollect('cts', 0.05);
    this.coinCountCollect('cts', 0.10);
    this.coinCountCollect('cts', 0.20);
    this.coinCountCollect('cts', 0.50);
    this.coinCountCollect('EUR', 1);
    this.coinCountCollect('EUR', 2);
    return this.coinsCounter;
  }

  private getItemFromStorage(key: string) {
    return this.sessionStorageService.getItem(key);
  }

  private updateIteminStorage(key:string, coins: Coin[]){
    this.sessionStorageService.updateItem('coins', coins);
  }


}
