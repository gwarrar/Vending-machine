import {TranslateService} from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CoinService } from './services/coin.service';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'VM';
  constructor(private productsService: ProductsService, private coinService: CoinService, public translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'de']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|de/) ? browserLang : 'de');
  }

  ngOnInit(): void {
    this.productsService.getAll();
    this.coinService.getAll();
  }

}
