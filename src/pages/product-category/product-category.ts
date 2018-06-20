import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProductCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-category',
  templateUrl: 'product-category.html',
})
export class ProductCategoryPage {
  id: any
  title: string
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.id = navParams.get("id")
    this.title = navParams.get("name")


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCategoryPage');
  }

  pushAddProduct(){
    this.myFunctionProvider.nav.push("AddProductPage", {id: this.id})
  }

}
