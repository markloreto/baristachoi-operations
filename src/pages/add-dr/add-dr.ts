import { IziToastSettings, default as iziToast } from 'izitoast';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyFunctionProvider } from './../../providers/my-function/my-function';

import moment from 'moment'
import _ from 'lodash'

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
  searchProducts: any = []
  grandTotal: number = 0

  selected: any = []

  rows: any = [];
  columns: any = [
    { prop: 'name', name: 'Name' },
    { prop: 'qty', name: 'Quantity' },
    { prop: 'cost', name: 'Price' },
    { prop: 'total', name: 'Total' },
    { prop: 'thumbnail', name: 'Thumbnail' }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
  ) {


    this.myFunctionProvider.dbQuery("SELECT p.id AS product_id, p.cost AS product_cost, p.price AS product_price, p.sku AS product_sku, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name, mu.abbr AS abbr FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id", []).then((products: any) => {
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
      this.searchProducts = grouped
      console.log("Products", grouped)
    })
    this.myForm = formBuilder.group({
      date: [moment().format("YYYY-MM-DD"), Validators.required],
      dr: ['', Validators.required],
      notes: [""]
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
    let m = this.modalCtrl.create("ItemsModalPage", { products: this.searchProducts });
    m.onDidDismiss(data => {
      this.products = data
      //this.rows = []
      var newCheckItems = []
      this.grandTotal = 0
      var l
      for (var x in this.products) {
        for (var y in this.products[x].items) {
          l = this.products[x].items
          if (l[y].checked) {
            newCheckItems.push({
              id: l[y].product_id,
              name: l[y].product_name,
              category: l[y].category_name,
              qty: l[y].qty,
              cost: l[y].product_cost,
              price: l[y].product_price,
              total: 0,
              abbr: l[y].abbr,
              thumbnail: l[y].product_thumbnail
            })
          }
        }
      }

      for (var x in this.rows) {
        for (var y in newCheckItems) {
          if (this.rows[x].id == newCheckItems[y].id) {
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

    let hide: IziToastSettings = {
      message: "",
      transitionOut: 'fadeOutUp',
      onClosing: (instance, toast, closedBy) => {
        var qty = parseInt(toast.querySelector("input").value)
        console.log("Qty", qty)

        if (!Number.isInteger(qty)) {
          iziToast.error({
            title: 'Wrong Input',
            message: 'Please input valid quantity only',
          });
        } else {
          this.grandTotal = 0
          for (var x in this.rows) {
            if (s.id == this.rows[x].id) {
              this.rows[x].qty = qty
              this.rows[x].total = qty * this.rows[x].cost
            }
            this.grandTotal += this.rows[x].total
          }
          console.log(this.rows)
          this.rows = [...this.rows]
        }
      }
    }

    let options: IziToastSettings = {
      image: (s.thumbnail) ? s.thumbnail : "assets/images/bc5.jpg",
      timeout: 0,
      close: true,
      overlay: true,
      toastOnce: true,
      id: 'quantity',
      title: s.name + "'s",
      message: 'quantity',
      position: 'center',
      inputs: [
        ['<input type="tel" value="' + ((s.qty) ? s.qty : 0) + '" placeholder="Input Quantity">', (instance, toast, input, e) => {
          console.info(input.nodeValue);
        }, true]
      ],
      buttons: [
        ['<button>Clear</button>', function (instance, toast) {
          toast.querySelector("input").value = "0"
        }, false],
        ['<button>Ok</button>', function (instance, toast) {
          instance.hide(hide, toast, "buttonName")
        }, false]
      ]
    }

    iziToast.question(options);
  }

  onActivate(event) {
    //console.log('Activate Event', event);
  }

  submit() {
    this.submitAttempt = true
    let fc = this.myForm.controls
    console.log(fc.date.value)
    if (!this.myForm.valid)
      return

    if (!this.rows.length) {
      this.segment = "items"
      iziToast.warning({
        title: 'Import items',
        message: 'List of items are empty',
      });
      return
    }

    for (var x in this.rows) {
      if (!this.rows[x].qty) {
        this.segment = "items"
        iziToast.warning({
          title: 'Oppps!',
          message: 'Please set the quantity for ' + this.rows[x].name,
        });
        return
      }
    }

    var t = this.myFunctionProvider.getTimestamp()
    var k = parseInt(this.myFunctionProvider.getTimestamp())
    var arr = []
    console.log(this.rows)

    this.myFunctionProvider.dbColValExist("delivery_receipts", "dr", fc.dr.value).then((val: any) => {
      if (val) {
        iziToast.warning({
          title: 'DR # ' + fc.dr.value,
          message: 'Already exist',
        });
      }
      else {
        this.myFunctionProvider.spinner(true, "Please wait")
        this.myFunctionProvider.dbQuery("INSERT OR REPLACE INTO delivery_receipts (id, dr, created_date, notes, sync, staff_id) VALUES (?, ?, ?, ?, ?, ?)", [t, fc.dr.value, fc.date.value + " 00:00:00", fc.notes.value, null, parseInt(this.myFunctionProvider.settings.logged_staff)]).then(() => {
          for (var x in this.rows) {
            if (this.rows[x].qty) {
              arr.push(["INSERT OR REPLACE INTO inventories (id, product_id, qty, price, cost, module_id, reference_id, type, sync, staff_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [k, this.rows[x].id, this.rows[x].qty, this.rows[x].price, this.rows[x].cost, 1, t, 1, null, parseInt(this.myFunctionProvider.settings.logged_staff)]])
              k++
            }
          }

          var s = parseInt(this.myFunctionProvider.getTimestamp())
          var arr2 = []

          this.myFunctionProvider.dbQueryBatch(arr).then(() => {
            for (var x in this.photos) {
              arr2.push(["INSERT OR REPLACE INTO attachments VALUES (?, ?, ?, ?, ?, ?, ?)", [s, parseInt(this.myFunctionProvider.settings.logged_staff), 1, t, this.photos[x].b64, this.photos[x].b64_preview, null]])
              s++
            }

            this.myFunctionProvider.dbQueryBatch(arr2).then(() => {
              this.myFunctionProvider.spinner(false, "Please wait")
              this.navCtrl.pop()
            })

          })
        })
      }
    })
  }

}
