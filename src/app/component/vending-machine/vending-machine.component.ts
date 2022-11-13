import { Product } from './../../models/product';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { MessageService } from 'primeng/api';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Coin } from 'src/app/models/coin';
import { CoinService } from 'src/app/services/coin.service';

@Component({
  selector: 'app-vending-machine',
  templateUrl: './vending-machine.component.html',
  styleUrls: ['./vending-machine.component.scss']
})
export class VendingMachineComponent implements OnInit {
  public totalMoneyAmount = 0;
  public showProduct: boolean = false;
  public products: Product[];
  public coins: Coin[];
  public screenMessage: string = 'Hi what would you like to order';
  public deactivateReturnButton: boolean = true;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private CurrencyPipe: CurrencyPipe,
    private sessionStorageService: SessionStorageService,
    private coinService: CoinService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.setStartMessage();
    this.products = this.sessionStorageService.getItem('Products');
    this.coins = this.sessionStorageService.getItem('coins');
  }

  public selectItem(product: Product) {
    if (product.avilableQuantity > 1) {
      if (this.totalMoneyAmount >= product.price) {
        this.totalMoneyAmount = this.totalMoneyAmount - product.price;
        let returnedAmount: number = this.totalMoneyAmount;
        this.productsService.updateProductQuantity(product.id, 1);
        this.products = this.sessionStorageService.getItem('Products');
        if (returnedAmount != 0) {
          this.products
          this.screenMessage = "please take your change :" + this.transformCurrency(this.totalMoneyAmount);
          setTimeout(() => {
            this.screenMessage = 'THANK YOU'
          }, 4000);
        } else {
          this.screenMessage = "THANK YOU";
        }
        this.deactivateReturnButton = true;
        this.totalMoneyAmount = 0;

      } else {
        this.showMessage('warn', 'Insert enough money Pleas')
      }
    } else {
      this.showMessage('warn', 'SOLD OUT : Sorry This product is not available currently , please choose Another Product')
    }
  }

  public setMoney(coinValue: number, currencyCode: string) {
    if (currencyCode == 'EUR' || currencyCode == 'cts') {
      if (coinValue * 100 % 5 == 0) {
        this.deactivateReturnButton = false;
        this.coinService.addCoin(this.difinedCoin(coinValue, currencyCode));
        this.coins = this.sessionStorageService.getItem('coins');
        this.sessionStorageService
        this.totalMoneyAmount = this.totalMoneyAmount + coinValue;
        this.screenMessage = 'Amount entered: ' + this.transformCurrency(this.totalMoneyAmount);
      } else {
        this.showMessage('error', 'Invalid ones', '1 and 2 Cent not accepted');
      }
    } else {
      this.showMessage('error', 'Invalid currency', 'please use Euro');
    }
  }


  difinedCoin(coinValue: number, currencyCode: string){
    let coin : Coin = new Coin();
    coin.id = this.coins.length + 1;
    coin.code = currencyCode;
    coin.vlaue = coinValue;
    return coin
  }

  public returnMoney() {
    this.screenMessage = 'Returned money ' + this.transformCurrency(this.totalMoneyAmount);
    this.coinService.subtractLastCoin();
    this.deactivateReturnButton = true;
    setTimeout(() => {
      this.totalMoneyAmount = 0;
    }, 2000);

  }

  public showMessage(severityType: string, summaryMessage: string, messageDetail?: string) {
    this.messageService.add({ severity: severityType, summary: summaryMessage, detail: messageDetail });
    setTimeout(() => {
      this.messageService.clear();
    }, 5000);
  }

  // private getAllProduct() {
  //   // return JSON.parse(sessionStorage.getItem('Products'));
  //   return this.sessionStorageService.getItem('Products');
  // }

  private setStartMessage() {
    setInterval(() => {
      if (this.totalMoneyAmount == 0) {
        this.screenMessage = 'Hi what would you like to order';
        setTimeout(() => {
          if (this.totalMoneyAmount == 0)
            this.screenMessage = 'INSERT COIN';
        }, 4000);
      }
    }, 8000);
  }

  private transformCurrency(currencyAmount: number, currencyCode: string = 'EUR'): string {
    if (currencyAmount < 1) currencyCode = 'cts'
    return this.CurrencyPipe.transform(currencyAmount, currencyCode, true);
  }
}