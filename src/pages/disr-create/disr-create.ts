import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IziToastSettings, default as iziToast } from 'izitoast';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';

import moment from 'moment'
import _ from 'lodash'

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';
import { FileServiceProvider } from '../../providers/file-service/file-service';
/**
 * Generated class for the DisrCreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disr-create',
  templateUrl: 'disr-create.html'
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
  storageDirectory: string = '';
  printView: string = 'RSO - Depot';
  printRSO: boolean = true
  printing: boolean = false

  showSubmit: boolean = true

  qrValue: any
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
  released_by: string
  pids: any = []
  deletes: any = []

  grandTotal: number = 0
  @ViewChild('forPrint') forPrint;

  prev: any = { seq: 0 }
  next: any = { seq: 0 }
  chart: any = {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private file: File,
    private fs: FileServiceProvider,
    private fileOpener: FileOpener,
    private socialSharing: SocialSharing
  ) {
    this.myFunctionProvider.spinner(false, "")
    this.staff_id = (navParams.get("staff_id")) ? navParams.get("staff_id") : parseInt(this.myFunctionProvider.settings.logged_staff)
    this.depot_id = this.myFunctionProvider.settings.depot.id
    this.dealer = navParams.get("dealer")
    this.released_by = navParams.get("staff_name")
    this.id = navParams.get("id")

    this.myForm = formBuilder.group({
      date: [moment().format("YYYY-MM-DDTHH:mm"), Validators.required],
      km_start: ['0', Validators.required],
      km_end: ['0', Validators.required],
      notes: [""]
    });

    if (!this.id) {

      this.myFunctionProvider.dbQuery("SELECT sequence FROM disrs ORDER BY sequence DESC LIMIT 1", []).then((seq: any) => {
        if (seq.length) {
          this.sequence = seq[0].sequence + 1
          this.start()
        } else {
          this.sequence = 1
          this.start()
        }
      })
    } else {
      this.sequence = navParams.get("sequence")
      this.start()
    }
  }

  openImage() {
    return new Promise((resolve) => {
      this.storageDirectory = this.fs.getStorageDirectory();
      let fName = this.printView + " - " + this.sequence + ".png"
      this.printing = true
      this.myFunctionProvider.spinner(true, 'Preparing ' + fName + "...")
      setTimeout(() => {
        let self = this
        var container = this.forPrint.nativeElement;

        var computedStyle = window.getComputedStyle(container, null)
        var trueHeight = parseFloat(computedStyle.height.replace("px", ""))
        var trueWidth = parseFloat(computedStyle.width.replace("px", ""))

        container.ownerDocument.defaultView.innerHeight = trueHeight + 1200
        container.ownerDocument.defaultView.innerWidth = trueWidth

        html2canvas(this.forPrint.nativeElement, {
          allowTaint: true
        }).then(canvas => {
          var img = canvas.toDataURL()

          self.fs.save(self.storageDirectory, fName, "image/png", img.replace("data:image/png;base64,", ""), true).then(_ => {
            self.myFunctionProvider.spinner(false, "")
            self.printing = false
            resolve(self.storageDirectory + fName)
            /* self.fileOpener.open(self.storageDirectory + fName, 'image/png').then(() => {

            }).catch(e => { console.log('Error openening file', e); self.myFunctionProvider.spinner(false, ".") }); */
          }).catch(_ => { self.myFunctionProvider.spinner(false, "."); })
        })
      }, 2000)
    })
  }

  loadAmount() {
    let t = 0
    for (let x in this.rows) {
      t += this.rows[x].price * (this.rows[x].load + this.rows[x].previous)
    }
    return t
  }

  start() {
    //prev
    this.myFunctionProvider.dbQuery("SELECT d.sequence AS seq, d.id AS ide FROM disrs d WHERE d.dealer_id = ? AND d.sequence < ? ORDER BY d.sequence DESC LIMIT 1", [this.dealer.id, this.sequence]).then((prev: any) => {
      console.log("Prev", prev)
      if (prev.length)
        this.prev = prev[0]
      else
        this.prev = { seq: 0 }
    })
    //next
    this.myFunctionProvider.dbQuery("SELECT d.sequence AS seq, d.id AS ide FROM disrs d WHERE d.dealer_id = ? AND d.sequence > ? ORDER BY d.sequence ASC LIMIT 1", [this.dealer.id, this.sequence]).then((next: any) => {
      console.log("Next", next)
      if (next.length)
        this.next = next[0]
      else
        this.next = { seq: 0 }
    })

    this.myFunctionProvider.getProducts().then((products: any) => {
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
      this.id = this.navParams.get("id")
      this.title = (this.id) ? "Modify Sequence # " + this.navParams.get("sequence") : "Add new DISR"

      if (this.id) {
        this.myFunctionProvider.spinner(true, "Please wait...")
        this.myFunctionProvider.dbQuery("SELECT * FROM disrs WHERE id = ?", [this.id]).then((disr: any) => {
          disr = disr[0]
          let qrItems = []
          this.sync = disr.sync
          fc.date.setValue(disr.created_date.replace(" ", "T").slice(0, -3))

          fc.notes.setValue(disr.notes)
          fc.km_start.setValue(disr.km_start)
          fc.km_end.setValue(disr.km_end)
          this.grandTotal = 0
          let newCheckItems = [] //sold // ifnull((SELECT SUM(i.qty - i.remaining) FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND product_id = p.id AND i.remaining IS NOT NULL AND i.module_id = 2 AND i.type = 2 AND strftime('%s', d.created_date) < strftime('%s', ?)), 0)
          this.myFunctionProvider.dbQuery("SELECT p.sequence AS sequence, inv.*, inv.price AS updated_price, ifnull((SELECT i.remaining FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND i.product_id = p.id AND d.sequence < ? AND i.module_id = 2 AND i.type = 2 ORDER BY d.sequence DESC LIMIT 1), 0) AS previous, p.name AS product_name, pc.name AS category_name, p.cost AS product_cost, p.price AS product_price, mu.abbr AS abbr, p.thumbnail AS product_thumbnail FROM inventories inv INNER JOIN products p ON inv.product_id = p.id INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE inv.module_id = 2 AND inv.reference_id = ? ORDER BY p.sequence ASC", [this.dealer.id, this.sequence, this.id]).then((invs: any) => {
            console.log("New INVS", invs)
            for (let x in invs) {
              newCheckItems.push({
                id: invs[x].id,
                sequence: invs[x].sequence,
                pid: invs[x].product_id,
                name: invs[x].product_name,
                category: invs[x].category_name,
                cost: invs[x].product_cost,
                price: invs[x].updated_price,
                abbr: invs[x].abbr,
                thumbnail: (invs[x].product_thumbnail) ? this.myFunctionProvider.sanitize(invs[x].product_thumbnail) : "assets/images/bc5.jpg",
                previous: invs[x].previous,
                load: invs[x].qty,
                remaining: (invs[x].remaining !== null) ? invs[x].remaining : "",
                total: invs[x].qty + invs[x].previous,
                sold: (invs[x].remaining !== null) ? invs[x].sold : "",
                amount: (invs[x].remaining !== null) ? invs[x].sold * invs[x].updated_price : ""
              })

              qrItems.push({ id: invs[x].product_id, prc: invs[x].updated_price, qty: invs[x].qty })

              if (newCheckItems[x].amount != - "")
                this.grandTotal += parseFloat(newCheckItems[x].amount)

              this.rows = [...newCheckItems]
              console.log("---", this.rows)
              //this.deletes.push({ table: "inventories", id: invs[x].id, sync: invs[x].sync })
              this.pids.push({ table: "inventories", ref: invs[x].product_id, tid: invs[x].id })
            }

            this.qrValue = "baristachoi://load/" + this.depot_id + "/" + this.sequence + "/" + this.staff_id + "/" + this.dealer.id + "/" + JSON.stringify(qrItems)


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
        this.myFunctionProvider.dbQuery("SELECT p.sequence AS sequence, mu.abbr AS abbr, pc.name AS category_name, p.*, ifnull((SELECT i.remaining FROM inventories i LEFT JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = ? AND i.product_id = p.id AND d.sequence < ? AND i.module_id = 2 AND i.type = 2 ORDER BY d.sequence DESC LIMIT 1), 0) AS previous FROM products p INNER JOIN product_categories pc ON p.category = pc.id INNER JOIN measurement_units mu ON p.measurement_unit = mu.id WHERE previous != 0 ORDER BY p.sequence ASC", [this.dealer.id, this.sequence]).then((invs: any) => {
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

  getSummaries(cat, field) {
    let total = 0
    for (let x in this.rows) {
      if (this.rows[x].category === cat) {
        if (this.rows[x][field] === "")
          return "Unset"

        total += this.rows[x][field]
      }
    }
    return total
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
      this.myFunctionProvider.spinner(true, "")
      let fc = this.myForm.controls
      let d = fc.date.value.replace("T", " ") + ":00"
      if(d.search("Z") != -1)
        d = d.slice(0, d.indexOf("Z"))
      this.myFunctionProvider.dbQuery("UPDATE disrs SET created_date = ?, sync = ? WHERE id = ?", [d, (this.sync == null) ? null : 3, this.id]).then(() => {
        this.navCtrl.push("DisrCreatePage", { sequence: this.sequence, staff_id: this.staff_id, id: this.id, dealer: this.dealer }).then(() => {
          this.navCtrl.remove((this.navCtrl.getActive().index) - 1, 1).then(() => {

          })
        })
      })

    }
  }

  goTo(seq) {
    this.myFunctionProvider.spinner(true, "")
    this.navCtrl.push("DisrCreatePage", { sequence: seq.seq, staff_id: this.staff_id, id: seq.ide, dealer: this.dealer }).then(() => {
      this.navCtrl.remove((this.navCtrl.getActive().index) - 1, 1).then(() => {

      });
    })
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
    let deyt = fc.date.value.replace("T", " ") + ":00"
      if(deyt.search("Z") != -1)
        deyt = deyt.slice(0, deyt.indexOf("Z"))

    if (this.id) {
      if (fc.date.value.search("Z") != -1) {
        fc.date.setValue(fc.date.value.slice(0, fc.date.value.lastIndexOf("Z") - 3))
      }
      arr.push(["UPDATE disrs SET created_date = ?, notes = ?, km_start = ?, km_end = ?, sync = ? WHERE id = ?", [deyt, fc.notes.value, fc.km_start.value, fc.km_end.value, (this.sync == null) ? null : 3, this.id]])
    }
    else
      arr.push(["INSERT OR REPLACE INTO disrs (id, staff_id, dealer_id, depot_id, created_date, sequence, notes, km_start, km_end, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [k, this.staff_id, this.dealer.id, this.depot_id, deyt, this.sequence, fc.notes.value, fc.km_start.value, fc.km_end.value, null]])

    let q = parseInt(this.myFunctionProvider.getTimestamp())
    console.log("pids", this.pids)
    console.log("rows", this.rows)
    for (let x in this.rows) {
      if (this.rows[x].total) {
        if (_.some(this.pids, { table: "inventories", ref: this.rows[x].pid })) {
          console.log("Update for product id", this.rows[x].pid)
          arr.push(["UPDATE inventories SET qty = ?, price = ?, cost = ?, type = ?, sync = ?, staff_id = ?, remaining = ?, sold = ? WHERE reference_id = ? AND module_id = ? AND product_id = ?", [this.rows[x].load, this.rows[x].price, this.rows[x].cost, 2, null, this.staff_id, this.rows[x].remaining, this.rows[x].sold, this.id, 2, this.rows[x].pid]])
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
      this.myFunctionProvider.scanUpdates(["inventories", "disrs"])
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

  menuBtn(e) {
    console.log(e)
    if (e.title == "Add Item") {
      this.segment = "items"
      this.addItem()
    }

    if (e.title == 'Share RSO') {
      this.printView = "RSO - Depot"
      this.printRSO = true
      let copies = []
      //
      this.openImage().then((p1:any) => {
        copies.push(p1)
        this.printView = "RSO - Roving"

        this.openImage().then((p2:any) => {
          copies.push(p2)
          this.printView = "RSO - Dealer"

          this.openImage().then((p3:any) => {
            copies.push(p3)
            this.socialSharing.shareWithOptions({files: copies})
          })
        })
      })
    }

    if (e.title == 'Share DISR') {
      this.printView = "DISR"
      this.printRSO = false
      this.openImage().then((p3:any) => {
        this.socialSharing.shareWithOptions({files: [p3]})
      })
    }
  }

  readableDate(date) {
    let fc = this.myForm.controls
    return moment(fc[date].value, "YYYY-MM-DD HH:mm").format("LLL")
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
        let r = this.selected[0]
        this.myFunctionProvider.getProducts(null, r.pid, false).then((p: any) => {
          console.log("Product", p)
          let m = this.modalCtrl.create("DisrProductModalPage", { row: r, loadEnabled: true/* (!this.id) ? true : false */, product: p[0] });
          m.onDidDismiss(row => {
            console.log(row)
            let index = _.findIndex(this.rows, { pid: row.pid })
            this.rows[index] = row
            this.rows = [...this.rows]
            this.grandTotal = 0
            for (let x in this.rows) {
              if (this.rows[x].amount !== "")
                this.grandTotal += parseFloat(this.rows[x].amount)
            }
          })
          this.myFunctionProvider.getProducts(null, r.pid, false).then((p: any) => {
            console.log("Product", m)
            m.present()
          })
        })
      }
    }

    contextMenuEvent.event.preventDefault();
    contextMenuEvent.event.stopPropagation();
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

  hideMySubmit() {
    this.showSubmit = false
  }

  showMySubmit() {
    this.showSubmit = true
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisrCreatePage');
  }

}
