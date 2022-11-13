import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './../models/product';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private products: Product[];
  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) { }

  public getAll(): any {
    this.http.get<Product[]>('./../../assets/mock/products.json').subscribe(res => {
      this.products = res;
      // this.setProductsInSessionStorage(this.products);
      this.sessionStorageService.createItem('Products',this.products);
    });;
  }

  public getProductsbyId(productId: number) {
    return this.http.get('')
  }

  public updateProductQuantity(productId: number, quantity: number) {
    // return this.
    let lastVersionProducts: Product[] = this.sessionStorageService.getItem('Products');
    lastVersionProducts.forEach(item => {
      if (item.id == productId) {
        item.avilableQuantity = item.avilableQuantity - quantity;
      }
    })
    // this.updateProductsInSessionStorage(lastVersionProducts);
    this.sessionStorageService.updateItem('Products',lastVersionProducts);
  }


  // private setProductsInSessionStorage(products: Product[]) {
  //   sessionStorage.setItem('Products', JSON.stringify(products));
  // }

  // private updateProductsInSessionStorage(products: Product[]) {
  //   sessionStorage.setItem('Products', JSON.stringify(products));
  // }

}
