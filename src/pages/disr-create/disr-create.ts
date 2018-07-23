import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IziToastSettings, default as iziToast } from 'izitoast';

import moment from 'moment'
import _ from 'lodash'
/**
 * Generated class for the DisrCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disr-create',
  templateUrl: 'disr-create.html',
})
export class DisrCreatePage {
  segment: string = "details"
  myForm: FormGroup;
  submitAttempt: boolean = false;

  kmTotal: number = 0

  selected: any = []
  products: any = []
  searchProducts: any = []

  title: string

  rows: any = [];
  columns: any = [
    { prop: 'name', name: 'Name' },
    { prop: 'previous', name: 'Previous' },
    { prop: 'load', name: 'New Load' },
    { prop: 'total', name: 'Total Load' },
    { prop: 'remaining', name: 'Remaining Stock' },
    { prop: 'sold', name: 'Sold' },
    { prop: 'price', name: 'Price' },
    { prop: 'amount', name: 'Amount' },
    { prop: 'sequence', name: 'Sequence', dir: 'asc' },
  ];

  id: any
  sync: any
  staff_id: number
  dealer: any
  depot_id: number
  sequence: number
  pids: any = []
  deletes: any = []

  grandTotal: number = 0

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController
  ) {
    this.staff_id = (navParams.get("staff_id")) ? navParams.get("staff_id") : parseInt(this.myFunctionProvider.settings.logged_staff)
    this.depot_id = this.myFunctionProvider.settings.depot.id
    this.dealer = navParams.get("dealer")
    this.id = navParams.get("id")

    if (!this.id) {

      this.myFunctionProvider.dbQuery("SELECT sequence FROM disrs ORDER BY sequence DESC LIMIT 1", []).then((seq: any) => {
        if (seq.length) {
          this.sequence = seq[0].sequence + 1
        } else {
          this.sequence = 1
        }
      })
    } else {
      this.sequence = navParams.get("sequence")
    }

    this.myForm = formBuilder.group({
      date: [moment().format("YYYY-MM-DDTHH:mm"), Validators.required],
      km_start: ['0', Validators.required],
      km_end: ['0', Validators.required],
      notes: [""]
    });

    this.myFunctionProvider.dbQuery("SELECT p.sequence AS sequence, p.id AS product_id, p.cost AS product_cost, p.price AS product_price, p.sku AS product_sku, p.thumbnail AS product_thumbnail, p.name AS product_name, pc.name AS category_name, mu.abbr AS abbr FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id ORDER BY p.sequence ASC", []).then((products: any) => {
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

      this.products = grouped
      this.searchProducts = grouped
      console.log("Products", grouped)

      //Edit Code
      let fc = this.myForm.controls
      this.id = navParams.get("id")
      this.title = (this.id) ? "Modify Sequence # " + navParams.get("sequence") : "Add new DR"

      if (this.id) {
        this.myFunctionProvider.spinner(true, "Please wait...")
        this.myFunctionProvider.dbQuery("SELECT * FROM disrs WHERE id = ?", [this.id]).then((disr: any) => {
          disr = disr[0]
          this.sync = disr.sync
          fc.date.setValue(disr.created_date.replace(" ", "T").slice(0, -3))
          fc.notes.setValue(disr.notes)
          this.grandTotal = 0
          let newCheckItems = [] //sold // ifnull((SELECT SUM(i.qty - i.remaining) FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND product_id = p.id AND i.remaining IS NOT NULL AND i.module_id = 2 AND i.type = 2 AND strftime('%s', d.created_date) < strftime('%s', ?)), 0)
          this.myFunctionProvider.dbQuery("SELECT p.sequence AS sequence, inv.*, ifnull((SELECT i.remaining FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND i.product_id = p.id AND d.sequence = ? AND i.module_id = 2 AND i.type = 2 LIMIT 1), 0) AS previous, p.name AS product_name, pc.name AS category_name, p.cost AS product_cost, p.price AS product_price, mu.abbr AS abbr, p.thumbnail AS product_thumbnail FROM inventories inv INNER JOIN products p ON inv.product_id = p.id INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE inv.module_id = 2 AND inv.reference_id = ? ORDER BY p.sequence ASC", [this.dealer.id, this.sequence - 1, this.id]).then((invs: any) => {
            console.log("New INVS", invs)
            for (let x in invs) {
              newCheckItems.push({
                id: invs[x].id,
                sequence: invs[x].sequence,
                pid: invs[x].product_id,
                name: invs[x].product_name,
                category: invs[x].category_name,
                cost: invs[x].product_cost,
                price: invs[x].product_price,
                abbr: invs[x].abbr,
                thumbnail: (invs[x].product_thumbnail) ? this.myFunctionProvider.sanitize(invs[x].product_thumbnail) : "assets/images/bc5.jpg",
                previous: invs[x].previous,
                load: invs[x].qty,
                remaining: (invs[x].remaining !== null) ? invs[x].remaining : "",
                total: invs[x].qty + invs[x].previous,
                sold: (invs[x].remaining !== null) ? invs[x].sold : "",
                amount: (invs[x].remaining !== null) ? invs[x].sold * invs[x].product_price : ""
              })

              if (newCheckItems[x].amount != - "")
                this.grandTotal += newCheckItems[x].amount

              this.rows = [...newCheckItems]
              //this.deletes.push({ table: "inventories", id: invs[x].id, sync: invs[x].sync })
              this.pids.push({ table: "inventories", ref: invs[x].product_id, tid: invs[x].id })
            }


            for (let x in grouped) {
              for (let y in grouped[x].items) {
                if (_.some(this.rows, { pid: grouped[x].items[y].product_id })) {
                  grouped[x].items[y].checked = true
                  grouped[x].items[y].disabled = true
                }
              }
            }

            this.products = [...grouped]
            this.searchProducts = [...grouped]

            this.myFunctionProvider.spinner(false, "")

          })
        })
      } else {
        let newCheckItems = [] //
        this.myFunctionProvider.dbQuery("SELECT p.sequence AS sequence, mu.abbr AS abbr, pc.name AS category_name, p.*, ifnull((SELECT i.remaining FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND i.product_id = p.id AND d.sequence = ? AND i.module_id = 2 AND i.type = 2 LIMIT 1), 0) AS previous FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE previous != 0 ORDER BY p.sequence ASC", [this.dealer.id, this.sequence - 1]).then((invs: any) => {
          console.log("New INVS", invs)
          for (let x in invs) {
            newCheckItems.push({
              id: null,
              sequence: invs[x].sequence,
              pid: invs[x].id,
              name: invs[x].name,
              category: invs[x].category_name,
              cost: invs[x].cost,
              price: invs[x].price,
              abbr: invs[x].abbr,
              thumbnail: (invs[x].thumbnail) ? this.myFunctionProvider.sanitize(invs[x].thumbnail) : "assets/images/bc5.jpg",
              previous: invs[x].previous,
              load: 0,
              remaining: "",
              total: invs[x].previous,
              sold: "",
              amount: ""
            })

          }

          this.rows = [...newCheckItems]

          for (let x in grouped) {
            for (let y in grouped[x].items) {
              if (_.some(this.rows, { pid: grouped[x].items[y].product_id })) {
                grouped[x].items[y].checked = true
                grouped[x].items[y].disabled = true
              }
            }
          }

          this.products = [...grouped]
          this.searchProducts = [...grouped]
        })
      }
    })
  }

  addItem() {
    let m = this.modalCtrl.create("ItemsModalPage", { products: this.searchProducts });
    m.onDidDismiss(data => {
      this.products = data
      //this.rows = []
      //let newCheckItems = []

      let l
      let i
      for (let x in this.products) {
        for (let y in this.products[x].items) {
          l = this.products[x].items
          i = _.findIndex(this.rows, { pid: l[y].product_id });
          if (l[y].checked && !_.some(this.rows, { pid: l[y].product_id })) {
            this.rows.push({
              id: null,
              sequence: l[y].sequence,
              pid: l[y].product_id,
              name: l[y].product_name,
              category: l[y].category_name,
              price: l[y].product_price,
              cost: l[y].product_cost,
              abbr: l[y].abbr,
              thumbnail: l[y].product_thumbnail,
              previous: 0,
              load: 0,
              remaining: "",
              total: 0,
              sold: "",
              amount: ""
            })
          } else if (!l[y].checked && i != -1) {
            if (this.rows[i].total === 0)
              this.rows.splice(i, 1);
          }
        }
      }

      this.rows = _.sortBy(this.rows, [function (o) { return o.sequence; }]);

      this.rows = [...this.rows]

    });
    m.present();
  }

  changeDate() {
    if (this.id) {
      let fc = this.myForm.controls
      this.myFunctionProvider.dbQuery("UPDATE disrs SET created_date = ?, sync = ? WHERE id = ?", [fc.date.value.replace("T", " ") + ":00", (this.sync == null) ? null : 3, this.id]).then(() => {
        this.navCtrl.push(this.navCtrl.getActive().component, { sequence: this.sequence, staff_id: this.staff_id, id: this.id, dealer: this.dealer }).then(() => {
          let index = this.viewCtrl.index;
          this.navCtrl.remove(index);
        })

      })

    }
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
        message: 'List of products are empty',
      });
      return
    }

    for (let x in this.rows) {
      if (!this.rows[x].total) {
        this.segment = "items"
        iziToast.warning({
          title: 'Oppps!',
          message: 'Please set the load quantity for ' + this.rows[x].name,
        });
        return
      }
    }

    let k = parseInt(this.myFunctionProvider.getTimestamp())

    let arr = []

    this.myFunctionProvider.spinner(true, "Please wait")

    if (this.id)
      arr.push(["UPDATE disrs SET created_date = ?, notes = ?, km_start = ?, km_end = ?, sync = ? WHERE id = ?", [fc.date.value.replace("T", " ") + ":00", fc.notes.value, fc.km_start.value, fc.km_end.value, (this.sync == null) ? null : 3, this.id]])
    else
      arr.push(["INSERT OR REPLACE INTO disrs (id, staff_id, dealer_id, depot_id, created_date, sequence, notes, km_start, km_end, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [k, this.staff_id, this.dealer.id, this.depot_id, fc.date.value.replace("T", " ") + ":00", this.sequence, fc.notes.value, fc.km_start.value, fc.km_end.value, null]])

    let q = parseInt(this.myFunctionProvider.getTimestamp())
    console.log("pids", this.pids)
    console.log("rows", this.rows)
    for (let x in this.rows) {
      if (this.rows[x].total) {
        if (_.some(this.pids, { table: "inventories", ref: this.rows[x].pid })) {
          console.log("Update for product id", this.rows[x].pid)
          arr.push(["UPDATE inventories SET qty = ?, price = ?, cost = ?, type = ?, sync = ?, staff_id = ?, remaining = ?, sold = ? WHERE reference_id = ? AND module_id = ? AND product_id = ?", [this.rows[x].load, this.rows[x].price, this.rows[x].cost, 2, 3, this.staff_id, this.rows[x].remaining, this.rows[x].sold, this.id, 2, this.rows[x].pid]])
        }

        else
          arr.push(["INSERT OR REPLACE INTO inventories (id, product_id, qty, price, cost, module_id, reference_id, type, sync, staff_id, depot_id, remaining, sold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [q, this.rows[x].pid, this.rows[x].load, this.rows[x].price, this.rows[x].cost, 2, (this.id) ? this.id : k, 2, null, this.staff_id, this.myFunctionProvider.settings.depot.id, (this.rows[x].remaining === null || this.rows[x].remaining === "") ? null : this.rows[x].remaining, (this.rows[x].sold === null || this.rows[x].sold === "") ? null : this.rows[x].sold]])
        q++
      }
    }

    for (let x in this.pids) {
      if (this.pids[x].table == "inventories") {
        if (!_.some(this.rows, { pid: this.pids[x].pid })) {
          this.deletes.push({ table: "inventories", id: this.pids[x].pid, sync: 3 })
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
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    console.log("Selected", this.selected)

  }


  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  onActivate(event) {
    /* console.log('Activate Event', event);
    if (event.type == "mouseenter") {

      let m = this.modalCtrl.create("DisrProductModalPage", { row: event.row });
      m.onDidDismiss(row => {
        console.log(row)
        let index = _.findIndex(this.rows, {pid: row.pid})
        this.rows[index] = row
        this.rows = [...this.rows]
      })


      m.present()

    } */
  }

  onTableContextMenu(contextMenuEvent) {
    console.log("Context Menu", contextMenuEvent);
    if (contextMenuEvent.type === 'body') {
      if (this.selected.length) {
        let m = this.modalCtrl.create("DisrProductModalPage", { row: this.selected[0] });
        m.onDidDismiss(row => {
          console.log(row)
          let index = _.findIndex(this.rows, { pid: row.pid })
          this.rows[index] = row
          this.rows = [...this.rows]
          this.grandTotal = 0
          for (let x in this.rows) {
            if (this.rows[x].amount !== "")
              this.grandTotal += this.rows[x].amount
          }
        })

        m.present()
      }
    }

    contextMenuEvent.event.preventDefault();
    contextMenuEvent.event.stopPropagation();
  }

  sumIt(g) {
    let gv = g.value
    let t = 0
    for (let x in gv) {
      if (Number.isInteger(gv[x].total))
        t = t + gv[x].total
    }

    return t
  }

  kmChange() {
    let fc = this.myForm.controls
    if (fc.km_start.value > fc.km_end.value) {
      fc.km_end.setValue(fc.km_start.value)
    }

    this.kmTotal = fc.km_end.value - fc.km_start.value
  }

  isValid(field) {
    return !this.myForm.controls[field].valid && (!!this.myForm.controls[field].dirty || this.submitAttempt)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisrCreatePage');
  }

}
