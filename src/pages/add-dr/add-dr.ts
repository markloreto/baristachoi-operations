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
  staff_id: number

  selected: any = []

  rows: any = [];
  columns: any = [
    { prop: 'name', name: 'Name' },
    { prop: 'qty', name: 'Quantity' },
    { prop: 'cost', name: 'Price' },
    { prop: 'total', name: 'Total' },
    { prop: 'thumbnail', name: 'Thumbnail' }
  ];

  id: any
  title: string = ""
  deletes: any = []
  pids: any = []
  sync: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
  ) {
    this.staff_id = parseInt(this.myFunctionProvider.settings.logged_staff)
    this.myForm = formBuilder.group({
      date: [moment().format("YYYY-MM-DD"), Validators.required],
      dr: ['', Validators.required],
      notes: [""]
    });

    this.myFunctionProvider.dbQuery("SELECT p.id AS product_id, p.cost AS product_cost, p.price AS product_price, p.sku AS product_sku, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name, mu.abbr AS abbr FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id", []).then((products: any) => {
      let grouped = _.chain(products)
        .groupBy('category_name')
        .map((items, category) => ({ items, category }))
        .value();

      for (let x in grouped) {
        for (let y in grouped[x].items) {
          grouped[x].items[y].disabled = false
          grouped[x].items[y].checked = false
          grouped[x].items[y].qty = 0
          grouped[x].items[y].product_thumbnail = (grouped[x].items[y].product_thumbnail) ? this.myFunctionProvider.sanitize(grouped[x].items[y].product_thumbnail) : "assets/images/bc5.jpg"
        }
      }
      this.products = grouped
      this.searchProducts = grouped
      console.log("Products", grouped)

      //Edit Code
      let fc = this.myForm.controls
      this.id = navParams.get("id")
      this.title = (navParams.get("dr")) ? "Modify DR # " + navParams.get("dr") : "Add new DR"

      if (this.id) {
        this.myFunctionProvider.spinner(true, "Please wait...")
        this.myFunctionProvider.dbQuery("SELECT * FROM delivery_receipts WHERE id = ?", [this.id]).then((dr: any) => {
          dr = dr[0]
          this.sync = dr.sync
          fc.dr.setValue(dr.dr)
          fc.date.setValue(dr.created_date.replace(" 00:00:00", ""))
          fc.notes.setValue(dr.notes)
          this.staff_id = dr.staff_id

          let newCheckItems = []
          this.myFunctionProvider.dbQuery("SELECT inv.*, p.name AS product_name, pc.name AS category_name, p.cost AS product_cost, p.price AS product_price, mu.abbr AS abbr, p.thumbnail AS product_thumbnail FROM inventories inv INNER JOIN products p ON inv.product_id = p.id INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE inv.module_id = ? AND inv.reference_id = ?", [1, this.id]).then((invs: any) => {
            for (let x in invs) {
              newCheckItems.push({
                id: invs[x].product_id,
                name: invs[x].product_name,
                category: invs[x].category_name,
                qty: invs[x].qty,
                cost: invs[x].product_cost,
                price: invs[x].product_price,
                total: invs[x].qty * invs[x].product_cost,
                abbr: invs[x].abbr,
                thumbnail: (invs[x].product_thumbnail) ? this.myFunctionProvider.sanitize(invs[x].product_thumbnail) : "assets/images/bc5.jpg"
              })

              this.grandTotal += newCheckItems[x].total
              this.rows = [...newCheckItems]
              //this.deletes.push({ table: "inventories", id: invs[x].id, sync: invs[x].sync })
              this.pids.push({ table: "inventories", ref: invs[x].product_id, tid: invs[x].id})
            }
            this.myFunctionProvider.dbQuery("SELECT * FROM attachments WHERE module_id = ? AND reference_id = ?", [1, this.id]).then((attachments: any) => {
              for (let x in attachments) {
                this.photos.push({ id: attachments[x].id, b64: attachments[x].b64, b64_preview: attachments[x].b64_preview })
                //this.deletes.push({ table: "attachments", id: attachments[x].id, sync: attachments[x].sync })
                this.pids.push({ table: "attachments", ref: attachments[x].id })
              }

              for (let x in grouped) {
                for (let y in grouped[x].items) {
                  if (_.some(this.rows, { id: grouped[x].items[y].product_id }))
                    grouped[x].items[y].checked = true
                }
              }

              this.products = [...grouped]
              this.searchProducts = [...grouped]

              this.myFunctionProvider.spinner(false, "")
            })
          })
        })
      }
    })

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
      let newCheckItems = []
      this.grandTotal = 0
      let l
      for (let x in this.products) {
        for (let y in this.products[x].items) {
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

      for (let x in this.rows) {
        for (let y in newCheckItems) {
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
    let s = selected[0]

    let hide: IziToastSettings = {
      message: "",
      transitionOut: 'fadeOutUp',
      onClosing: (instance, toast, closedBy) => {
        let qty = parseInt(toast.querySelector("input").value)
        console.log("Qty", qty)

        if (!Number.isInteger(qty)) {
          iziToast.error({
            title: 'Wrong Input',
            message: 'Please input valid quantity only',
          });
        } else {
          this.grandTotal = 0
          for (let x in this.rows) {
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

    for (let x in this.rows) {
      if (!this.rows[x].qty) {
        this.segment = "items"
        iziToast.warning({
          title: 'Oppps!',
          message: 'Please set the quantity for ' + this.rows[x].name,
        });
        return
      }
    }

    let t = this.myFunctionProvider.getTimestamp()
    let k = parseInt(this.myFunctionProvider.getTimestamp())
    let arr = []
    console.log(this.rows)

    this.myFunctionProvider.dbColValExist("delivery_receipts", "dr", fc.dr.value).then((val: any) => {

      if (!this.id) {
        if (val) {
          iziToast.warning({
            title: 'DR # ' + fc.dr.value,
            message: 'Already exist',
          });
          return
        }
      }


      this.myFunctionProvider.spinner(true, "Please wait")
      //this.myFunctionProvider.dbQuery("INSERT OR REPLACE INTO delivery_receipts (id, dr, created_date, notes, sync, staff_id) VALUES (?, ?, ?, ?, ?, ?)", [t, fc.dr.value, fc.date.value + " 00:00:00", fc.notes.value, null, this.staff_id]).then(() => {
      if (this.id)
        arr.push(["UPDATE delivery_receipts SET dr = ?, created_date = ?, notes = ?, sync = ?, staff_id = ? WHERE id = ?", [fc.dr.value, fc.date.value + " 00:00:00", fc.notes.value, (this.sync == null) ? null : 3, this.staff_id, this.id]])
      else
        arr.push(["INSERT OR REPLACE INTO delivery_receipts (id, dr, created_date, notes, sync, staff_id, depot_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [t, fc.dr.value, fc.date.value + " 00:00:00", fc.notes.value, null, this.staff_id, this.myFunctionProvider.settings.depot.id]])

      for (let x in this.rows) {
        if (this.rows[x].qty) {
          if(_.some(this.pids, { table: "inventories", ref: this.rows[x].id}))
            arr.push(["UPDATE inventories SET qty = ?, price = ?, cost = ?, type = ?, sync = ?, staff_id = ? WHERE reference_id = ? AND module_id = ? AND product_id = ?", [this.rows[x].qty, this.rows[x].price, this.rows[x].cost, 1, 3, this.staff_id, this.id, 1, this.rows[x].id]])
          else
            arr.push(["INSERT OR REPLACE INTO inventories (id, product_id, qty, price, cost, module_id, reference_id, type, sync, staff_id, depot_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [k, this.rows[x].id, this.rows[x].qty, this.rows[x].price, this.rows[x].cost, 1, (this.id) ? this.id : t, 1, null, this.staff_id, this.myFunctionProvider.settings.depot.id]])
          k++
        }
      }

      let s = parseInt(this.myFunctionProvider.getTimestamp())
      //let arr2 = []

      //this.myFunctionProvider.dbQueryBatch(arr).then(() => {
      for (let x in this.photos) {
        if(_.some(this.pids, { table: "attachments", ref: this.photos[x].id}))
          arr.push(["UPDATE attachments SET staff_id = ?, b64 = ?, b64_preview = ?, sync = ? WHERE id = ?", [this.staff_id, this.photos[x].b64, this.photos[x].b64_preview, 3, this.photos[x].id]])
        else
          arr.push(["INSERT OR REPLACE INTO attachments VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [s, this.staff_id, 1, (this.id) ? this.id : t, this.photos[x].b64, this.photos[x].b64_preview, this.myFunctionProvider.settings.depot.id, null]])
        s++
      }

      for(let x in this.pids){
        if(this.pids[x].table == "inventories"){
          if(!_.some(this.rows, { id: this.pids[x].ref})){
            this.deletes.push({ table: "inventories", id: this.pids[x].tid, sync: 3 })
          }
        }
        else{
          if(!_.some(this.photos, { id: this.pids[x].ref})){
            this.deletes.push({ table: "attachments", id: this.pids[x].ref, sync: 3 })
          }
        }
      }

      this.myFunctionProvider.dbQueryBatch(arr).then(() => {
        if (this.id) {
          this.myFunctionProvider.deleteSync(this.deletes).then(() => {
            this.myFunctionProvider.spinner(false, "Please wait")
            this.navCtrl.pop()
          })
        } else {
          this.myFunctionProvider.spinner(false, "Please wait")
          this.navCtrl.pop()
        }
      })

      //})
      //})

    })

  }

}
