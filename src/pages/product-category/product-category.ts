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
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public menuItems: MenuItems,
  ) {
    let myMenu = this.menuItems.getAll()
    this.myMenu = myMenu
    this.id = navParams.get("id")
    this.title = navParams.get("name")
  }

  loadIt(){
    this.products = []
    this.myFunctionProvider.dbQuery("SELECT mu.name AS unit_name, p.pack AS pack, p.id AS product_id, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name, (ifnull((SELECT SUM(qty) FROM inventories WHERE type = 1 AND product_id = p.id), 0) - ifnull((SELECT SUM(qty) FROM inventories WHERE type = 2 AND product_id = p.id), 0)) AS numKilos FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE p.category = ? ORDER BY p.sequence ASC", [this.id]).then((p: any) => {
      let total = 0
      for(let x in p){
        p[x].product_thumbnail = (p[x].product_thumbnail) ? this.myFunctionProvider.sanitize(p[x].product_thumbnail) : "assets/images/bc5.jpg"
        this.products.push(p[x])
        total += p[x].numKilos
      }
      console.log("Products", this.products)
      let i = _.findIndex(this.myMenu[0].main[0].children, { 'name': this.title});
      this.myMenu[0].main[0].children[i].badge = [{type: "warning", value: total}]
    })
  }

  reorderItems(indexes) {
    let element = this.products[indexes.from];
    this.products.splice(indexes.from, 1);
    this.products.splice(indexes.to, 0, element);
    let arr = []
    for(let x in this.products){
      arr.push(["UPDATE products SET sequence = ?, sync = 3 WHERE id = ?", [x, this.products[x].product_id]])
    }

    this.myFunctionProvider.dbQueryBatch(arr)
  }

  ionViewWillEnter(){
    this.loadIt()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductCategoryPage');
  }

  pushAddProduct(){
    this.myFunctionProvider.nav.push("AddProductPage", {id: this.id})
  }

}
