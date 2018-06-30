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
  products: any = []
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.id = navParams.get("id")
    this.title = navParams.get("name")

    this.loadIt()
  }

  loadIt(){
    this.products = []
    this.myFunctionProvider.dbQuery("SELECT p.id AS product_id, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name FROM products p INNER JOIN product_categories pc ON p.category = pc.id WHERE p.category = ?", [this.id]).then((p: any) => {
      console.log(p)
      for(var x in p){
        p[x].product_thumbnail = (p[x].product_thumbnail) ? this.myFunctionProvider.sanitize(p[x].product_thumbnail) : "assets/images/bc5.jpg"
        this.products.push(p[x])
      }
      console.log(this.products)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCategoryPage');
  }

  pushAddProduct(){
    this.myFunctionProvider.nav.push("AddProductPage", {id: this.id})
  }

}
