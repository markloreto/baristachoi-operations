import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import _ from 'lodash'
import moment from 'moment'
/**
 * Generated class for the EndoresmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-endorsement',
  templateUrl: 'endorsement.html',
})
export class EndorsementPage {
  categories: any = []
  searchCat: any = []
  resetter: any = []
  notes: string = ""
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.spinner(false, "")
  }

  loadIt() {
    this.myFunctionProvider.getProducts(null, null, false, true).then((products: any) => {
      let grouped = _.chain(products)
        .groupBy('category_name')
        .map((items, category) => ({ items, category }))
        .value();

      for (let x in grouped) {
        for (let y in grouped[x].items) {
          grouped[x].items[y].disabled = false
          grouped[x].items[y].checked = false
          grouped[x].items[y].product_thumbnail = (grouped[x].items[y].product_thumbnail) ? this.myFunctionProvider.sanitize(grouped[x].items[y].product_thumbnail) : "assets/images/bc5.jpg"
        }
      }

      console.log(grouped)
      this.categories = [...grouped]
      this.searchCat = [...grouped]
      this.resetter = [...grouped]
    })
  }

  submit() {
    let id =  this.myFunctionProvider.getTimestamp()
    let s =  parseInt(this.myFunctionProvider.getTimestamp()) + 1
    let arr = []
    let staff_id = this.myFunctionProvider.settings.logged_staff
    let depot_id = this.myFunctionProvider.settings.depot.id
    this.myFunctionProvider.spinner(true, "Submitting...")
    arr.push(["INSERT INTO endorsements (id, staff_id, created_date, notes, depot_id, sync) VALUES (?, ?, ?, ?, ?, ?)", [id, this.myFunctionProvider.settings.logged_staff, moment().format("YYYY-MM-DD HH:mm:ss"), this.notes, this.myFunctionProvider.settings.depot.id, null]])
    for (let x in this.categories) {
      for (let y in this.categories[x].items) {
        if(this.categories[x].items[y].checked){
          s = s + 1
          arr.push(["INSERT INTO endorsement_items (id, staff_id, reference_id, product_id, qty, depot_id, sync) VALUES (?, ?, ?, ?, ?, ?, ?)", [s, staff_id, id, this.categories[x].items[y].product_id, this.categories[x].items[y].stocks, depot_id, null]])
        }
      }
    }

    this.myFunctionProvider.dbQueryBatch(arr).then(() => {
      this.myFunctionProvider.scanUpdates(["endorsement_items", "endorsements"])
      this.myFunctionProvider.spinner(false, "")
      this.navCtrl.pop()
    })

    console.log(arr)
  }

  initializeItems(){
    this.resetter = [...this.resetter]
    this.categories = [...this.resetter]
    this.searchCat = [...this.resetter]
  }

  updateC() {
    console.log(this.categories)
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

  ionViewDidEnter() {
    this.loadIt()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EndoresmentPage');
  }

}
