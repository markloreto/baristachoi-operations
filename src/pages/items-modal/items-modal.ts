import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import _ from 'lodash'

/**
 * Generated class for the ItemsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-items-modal',
  templateUrl: 'items-modal.html',
})
export class ItemsModalPage {
  categories: any = []
  searchCat: any = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.categories = navParams.get("products")
    console.log(this.categories)
  }

  initializeItems(){
    this.categories = this.navParams.get("products")
    this.searchCat = this.navParams.get("products")
  }

  updateC(){
    console.log(this.categories)
  }

  submit(){
    this.initializeItems();
    this.viewCtrl.dismiss(this.categories);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsModalPage');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      /* this.categories = this.categories.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      }) */
      //this.categories = _.filter(this.categories, {items: [{name: 'Food'}] });
      let a = []
      let b = []

      for(let x in this.searchCat){
        //b.push(this.searchCat[x])
        a = this.searchCat[x].items.filter((item2) => {
          return (item2.product_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
        if(a.length){
          b.push({items: a, category: this.searchCat[x].category})
        }

      }

      this.categories = b

      //console.log(this.categories)
    }
  }

}
