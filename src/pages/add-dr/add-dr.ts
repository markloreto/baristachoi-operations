import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import moment from 'moment'
import _ from 'lodash'
import swal from 'sweetalert2';

/**
 * Generated class for the AddDrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-dr',
  templateUrl: 'add-dr.html',
})
export class AddDrPage {
  @ViewChild('myTable') table: any;
  segment: string = "details"
  myForm: FormGroup;
  submitAttempt: boolean = false;
  photos: any = []
  products: any = []
  grandTotal: number = 0

  selected: any = []

  rows: any = [];
  columns: any = [
    { prop: 'name', name: 'Name' },
    { prop: 'qty', name: 'Quantity' },
    { prop: 'price', name: 'Price' },
    { prop: 'total', name: 'Total' }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController
  ) {
    this.myFunctionProvider.dbQuery("SELECT p.id AS product_id, p.cost AS product_price, p.sku AS product_sku, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name, mu.abbr AS abbr FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id", []).then((products: any) => {
      var grouped = _.chain(products)
        .groupBy('category_name')
        .map((items, category) => ({ items, category }))
        .value();

      for (var x in grouped) {
        for (var y in grouped[x].items) {
          grouped[x].items[y].checked = false
          grouped[x].items[y].qty = 0
          grouped[x].items[y].product_thumbnail = (grouped[x].items[y].product_thumbnail) ? this.myFunctionProvider.sanitize(grouped[x].items[y].product_thumbnail) : "assets/images/bc5.jpg"
        }
      }

      this.products = grouped
      console.log("Products", grouped)
    })
    this.myForm = formBuilder.group({
      date: [moment().format("YYYY-MM-DD"), Validators.required],
      dr: ['', Validators.required],
      note: [""]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDrPage');
  }

  isValid(field) {
    return !this.myForm.controls[field].valid && (!!this.myForm.controls[field].dirty || this.submitAttempt)
  }

  addFromCamera() {
    this.myFunctionProvider.takePicture().then((photoData: any) => {
      console.log("Photo Data", photoData)
      this.photos.push({ id: null, b64: photoData.photo, b64_preview: photoData.thumbnail })
    })
  }

  addFromFile() {
    this.myFunctionProvider.fileChooser.open().then(uri => {
      this.myFunctionProvider.imageProcess(uri).then((photoData: any) => {
        this.photos.push({ id: null, b64: photoData.photo, b64_preview: photoData.thumbnail })
      })
    }).catch(e => console.log(e));
  }

  trashPhoto(item) {
    this.photos.splice(item, 1)
  }

  addItem() {
    let m = this.modalCtrl.create("ItemsModalPage", { products: this.products });
    m.onDidDismiss(data => {
      this.products = data
      //this.rows = []
      var newCheckItems = []
      this.grandTotal = 0
      var l
      for (var x in this.products) {
        for (var y in this.products[x].items) {
          l = this.products[x].items
          if (l[y].checked){
            newCheckItems.push({
              id: l[y].product_id,
              name: l[y].product_name,
              category: l[y].category_name,
              qty: l[y].qty,
              price: l[y].product_price,
              total: 0,
              abbr: l[y].abbr
            })
          }
        }
      }

      for(var x in this.rows){
        for(var y in newCheckItems){
          if(this.rows[x].id == newCheckItems[y].id){
            newCheckItems[y].qty = this.rows[x].qty
            newCheckItems[y].total = this.rows[x].total
            this.grandTotal += this.rows[x].total
          }
        }
      }

      this.rows = newCheckItems

    });
    m.present();
  }

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    console.log("Selected", this.selected)
    //this.selected = []
    var s = selected[0]

    swal({
      title: 'Quantity for ' + s.name,
      input: 'tel',
      inputValue: (s.qty) ? s.qty : "",
      inputPlaceholder: 'Input Quantity',
      showCancelButton: true,
    }).then(qty => {
      qty = parseInt(qty)
      if (!Number.isInteger(qty)) {
        swal({
          type: 'error',
          title: 'Wrong Input',
          text: 'Please input valid quantity only'
        })
      } else {
        var l
        this.grandTotal = 0
        for (var x in this.rows) {
          if(s.id == this.rows[x].id){
            this.rows[x].qty = qty
            this.rows[x].total = qty * this.rows[x].price
          }
          this.grandTotal += this.rows[x].total
        }
        console.log(this.rows)
        this.rows = [...this.rows]
      }
    })
  }

  onActivate(event) {
    //console.log('Activate Event', event);
  }

  submit() {
    let fc = this.myForm.controls
    console.log(fc.date.value)
  }

}
