import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ActionSheetController } from 'ionic-angular';
import moment from 'moment'

/**
 * Generated class for the DeliveryReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delivery-receipt',
  templateUrl: 'delivery-receipt.html',
})
export class DeliveryReceiptPage {
  rows: any = [];
  columns: any = [
    { prop: 'date', name: 'Date', minWidth: 130, width: 130 },
    { prop: 'dr', name: 'DR #', minWidth: 60, width: 60  },
    { prop: 'numKilos', name: 'No. of Kilos', minWidth: 90, width: 90 },
    { prop: 'amount', name: 'Amount', minWidth: 100, width: 100 },
    { prop: 'staff_name', name: 'Created By', minWidth: 150, width: 150 },
    { prop: 'status', name: 'Status', minWidth: 90, width: 90 },
  ];
  selected: any = []
  page: any = {
    count: 0,
    offset: 0,
    limit: 5
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    private myFunctionProvider: MyFunctionProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

    /* this.myFunctionProvider.dbQuery("SELECT * FROM inventories", []).then((q: any) => {
      console.log("inv", q)
    })

    this.myFunctionProvider.dbQuery("SELECT * FROM attachments", []).then((q: any) => {
      console.log("attachments", q)
    }) */

  }

  loadIt(pageInfo){
    console.log("Page Info", pageInfo)
    this.rows = []
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.dbQuery("SELECT COUNT(*) AS num FROM delivery_receipts", []).then((data: any) => {
      this.page.count = data[0].num
      console.log("Total DRS:", data[0].num)
      this.page.offset = pageInfo.offset;

      this.myFunctionProvider.dbQuery("SELECT s.id AS staff_id, s.name AS staff_name, myDr.*, ifnull((SELECT SUM(inv.qty) FROM inventories inv JOIN products p ON inv.product_id = p.id WHERE reference_id = myDr.id AND p.category = 1 AND inv.type = 1 AND module_id = 1), 0) AS numKilos, (SELECT SUM(qty * cost) FROM inventories WHERE reference_id = myDr.id AND module_id = 1) AS amount FROM delivery_receipts myDr INNER JOIN staffs s ON myDr.staff_id = s.id ORDER BY myDr.dr DESC LIMIT 5 OFFSET " + (pageInfo.offset * this.page.limit), []).then((drs: any) => {
        let array = []
        console.log("Drs", drs)
        for(let x in drs){
          array.push({staff_id: drs[x].staff_id, id: drs[x].id, date: moment(drs[x].created_date.replace(" 00:00:00", ""), "YYYY-MM-DD").format("LL"), dr: drs[x].dr, numKilos: drs[x].numKilos + ((drs[x].numKilos) ? " Kgs" : " kg"), amount: "₱ " + drs[x].amount.toLocaleString(), status: "Pending", sync: drs[x].sync, staff_name: drs[x].staff_name})
        }
        this.rows = array
        this.myFunctionProvider.spinner(false, "")
      })
    })

  }

  presentActionSheet(s) {
    console.log("Selected", this.selected)
    let buttons = []
    if(this.myFunctionProvider.settings.logged_staff == s.staff_id){
      buttons.push({
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.myFunctionProvider.nav.push("AddDrPage", {id: s.id, dr: s.dr})
        }
      })

      buttons.push({
        icon: 'trash',
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.myFunctionProvider.toastConfirm("DR # " + s.dr, "Delete?", "fa fa-trash").then((b: any) => {
            if(b){
              //todo
              this.myFunctionProvider.spinner(true, "Removing from database")
              let array = []
              array.push({table: "delivery_receipts", id: s.id, sync: s.sync})
              this.myFunctionProvider.dbQuery("SELECT id, sync FROM attachments WHERE module_id = 1 AND reference_id = ?", [s.id]).then((attachmentIds: any) => {
                for(let x in attachmentIds){
                  array.push({table: "attachments", id: attachmentIds[x].id, sync: attachmentIds[x].sync})
                }
                this.myFunctionProvider.dbQuery("SELECT id, sync FROM inventories WHERE reference_id = ? AND module_id = 1", [s.id]).then((invIds: any)=> {
                  for(let x in invIds){
                    array.push({table: "inventories", id: invIds[x].id, sync: invIds[x].sync})
                  }

                  this.myFunctionProvider.deleteSync(array).then(() => {
                    this.myFunctionProvider.spinner(false, "")
                    this.loadIt({offset: this.page.offset})
                  })
                })
              })
            }
          })
        }
      })
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    })

    const actionSheet = this.actionSheetCtrl.create({
      title: 'What to do with DR # ' + s.dr,
      buttons: buttons
    });
    actionSheet.present();
  }

  ionViewWillEnter(){
    this.loadIt({ offset: 0 })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryReceiptPage');
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock();
  }

  onActivate(event) {
    //console.log('Activate Event', event);
  }

  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    console.log("Selected", this.selected)
    //this.selected = []
    let s = selected[0]
    this.presentActionSheet(s)


  }

  add(){
    this.myFunctionProvider.nav.push("AddDrPage")
  }

}
