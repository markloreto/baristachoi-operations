import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuItems } from './../../shared/menu-items/menu-items';

import * as _ from 'lodash'

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
  myMenu: any = []
  reorder: boolean = false
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public menuItems: MenuItems,
  ) {
    this.myFunctionProvider.spinner(false, "")
    let myMenu = this.menuItems.getAll()
    this.myMenu = myMenu
    this.id = navParams.get("id")
    this.title = navParams.get("name")
  }

  loadIt(){
    this.products = []
    this.myFunctionProvider.getProducts(this.id).then((p: any) => {
      let total = 0
      for(let x in p){
        p[x].product_thumbnail = (p[x].product_thumbnail) ? this.myFunctionProvider.sanitize(p[x].product_thumbnail) : "assets/images/bc5.jpg"
        this.products.push(p[x])
        total += p[x].stocks
      }
      console.log("Products", this.products)
      let i = _.findIndex(this.myMenu[0].main[0].children, { 'name': this.title});
      this.myMenu[0].main[0].children[i].badge = [{type: "warning", value: total}]
    })
  }

  modify(pid){
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.nav.push("AddProductPage", {cat_id: this.id, id: pid})
  }

  reorderItems(indexes) {
    let element = this.products[indexes.from];
    this.products.splice(indexes.from, 1);
    this.products.splice(indexes.to, 0, element);
    let arr = []
    for(let x in this.products){
      arr.push(["UPDATE products SET sequence = ?, sync = 3 WHERE id = ?", [x, this.products[x].product_id]])
    }
    this.myFunctionProvider.spinner(true, "Updating...")
    this.myFunctionProvider.dbQueryBatch(arr).then(() => {
      this.myFunctionProvider.spinner(false, "")
    })
  }

  ionViewWillEnter(){
    this.loadIt()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCategoryPage');
  }

  pushAddProduct(){
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.nav.push("AddProductPage", {cat_id: this.id})
  }

  menuBtn(e){
    console.log(e)
    if(e.title === "Arrange"){
      this.reorder = (this.reorder) ? false : true
    }
    if(e.title === "New Product"){
      this.pushAddProduct()
    }
  }

}
