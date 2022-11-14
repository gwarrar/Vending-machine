import { Product } from './../../models/product';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { MessageService } from 'primeng/api';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Coin } from 'src/app/models/coin';
import { CoinService } from 'src/app/services/coin.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

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
  public screenMessage: string  ;
  public deactivateReturnButton: boolean = true;

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private CurrencyPipe: CurrencyPipe,
    private sessionStorageService: SessionStorageService,
    private coinService: CoinService,
    private decimalPipe: DecimalPipe,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setStartMessage();
    this.products = this.getItemFromStorage('Products');
    this.coins = this.getItemFromStorage('coins');
    this.translate('GREETING_MESSAGE')

    this.translateService.onLangChange.subscribe((_event: LangChangeEvent) => {
      this.screenMessage = this.translate('GREETING_MESSAGE');
  });
  }

  public selectItem(product: Product) {
    if (product.avilableQuantity > 1) {
      if (this.totalMoneyAmount >= product.price) {
        this.totalMoneyAmount = this.totalMoneyAmount - product.price;
        let returnedAmount: number = this.totalMoneyAmount;
        this.productsService.updateProductQuantity(product.id, 1);
        this.products = this.getItemFromStorage('Products');
        if (returnedAmount != 0) {
          // this.giveChange(returnedAmount);
          this.screenMessage = this.translate("TAKE_CHANGE")  + this.transformCurrency(this.totalMoneyAmount);
          setTimeout(() => {
            this.screenMessage = this.translate('THANK_YOU');
          }, 4000);
        } else {
          this.screenMessage = this.translate('THANK_YOU');
        }
        this.deactivateReturnButton = true;
        this.totalMoneyAmount = 0;

      } else {
        this.showMessage('warn', this.translate('INSERT_ENOUGH_MONEY'))
      }
    } else {
      this.showMessage('warn', this.translate('SOLD_OUT_MESSAGE'))
    }
  }

  public setMoney(coinValue: number, currencyCode: string) {
    if (currencyCode == 'EUR' || currencyCode == 'cts') {
      if (coinValue * 100 % 5 == 0) {
        this.deactivateReturnButton = false;
        this.coinService.addCoin(this.difinedCoin(coinValue, currencyCode));
        this.coins = this.getItemFromStorage('coins');
        this.totalMoneyAmount = this.totalMoneyAmount + coinValue;
        this.screenMessage = 'Amount entered: ' + this.transformCurrency(this.totalMoneyAmount);
      } else {
        this.showMessage('error', this.translate('INVALID_COIN'));
      }
    } else {
      this.showMessage('error',this.translate('INVALID_CURRENCY'));
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
    this.screenMessage = this.translate('RETURNED_MONEY') + this.transformCurrency(this.totalMoneyAmount);
    this.coinService.subtractLastCoin();
    this.deactivateReturnButton = true;
    setTimeout(() => {
      this.totalMoneyAmount = 0;
    }, 2000);

  }

  // giveChange(returnedAmount: number){
  //   let coins: Coin[] = this.getItemFromStorage('coins');
  //   let coinsCollect = this.coinService.coinsCollector();

  //   coins.forEach(coin => {
  //     if(coin.vlaue == returnedAmount){
  //         this.coinService.deleteCoinbyValue(coin);
  //     }
  //   });
  // }

  private getItemFromStorage(key: string) {
    return this.sessionStorageService.getItem(key);
  }

  public showMessage(severityType: string, summaryMessage: string, messageDetail?: string) {
    this.messageService.add({ severity: severityType, summary: summaryMessage, detail: messageDetail });
    setTimeout(() => {
      this.messageService.clear();
    }, 5000);
  }

  private setStartMessage() {
    setInterval(() => {
      if (this.totalMoneyAmount == 0) {
        this.screenMessage = this.translate('GREETING_MESSAGE');
        setTimeout(() => {
          if (this.totalMoneyAmount == 0)
            this.screenMessage = this.translate('INSERT_COIN');
        }, 4000);
      }
    }, 8000);
  }

  private transformCurrency(currencyAmount: number, currencyCode: string = 'EUR'): string {
    if (currencyAmount < 1) currencyCode = 'cts'
    return this.CurrencyPipe.transform(currencyAmount, currencyCode, true);
  }

  public changeLanguage(langCode: string){
      this.translateService.use(langCode);
  }

  public translate(param: string): string {
    let value: string = this.translate('TRANSLATION-ERROR');
    this.translateService.get(param).subscribe(translation => value = translation);
    return value;
  }
}
