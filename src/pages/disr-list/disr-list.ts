import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import moment from 'moment'
/**
 * Generated class for the DisrListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disr-list',
  templateUrl: 'disr-list.html',
})
export class DisrListPage {
  openMenu = false;
  rows: any = [];
  columns: any = [
    { prop: 'dealer', name: 'Dealer', minWidth: 150, width: 150 },
    { prop: 'created_date', name: 'Date', minWidth: 160, width: 160 },
    { prop: 'sequence', name: 'Sequence #', minWidth: 75, width: 75 },
    { prop: 'release_by', name: 'Released By', minWidth: 150, width: 150 },
  ];
  selected: any = []
  page: any = {
    count: 0,
    offset: 0,
    limit: 30
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public myFunctionProvider: MyFunctionProvider,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.myFunctionProvider.dbQuery("SELECT * FROM disrs", []).then((disrs: any) => {
      console.log("DISRS", disrs)
    })

    this.myFunctionProvider.dbQuery("SELECT * FROM inventories WHERE module_id = 2", []).then((invs: any) => {
      console.log("INVS", invs)
    })
  }

  loadIt(pageInfo) {
    console.log("Page Info", pageInfo)
    this.rows = []
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.dbQuery("SELECT COUNT(id) AS num FROM disrs", []).then((data: any) => {
      this.page.count = data[0].num
      console.log("Total DRS:", data[0].num)
      this.page.offset = pageInfo.offset;

      this.myFunctionProvider.dbQuery("SELECT s.id AS staff_id, s.name AS staff_name, d.*, (SELECT name FROM staffs WHERE id = d.dealer_id) AS dealer, (SELECT id FROM staffs WHERE id = d.dealer_id) AS dealer_id, (SELECT thumbnail FROM staffs WHERE id = d.dealer_id) AS thumbnail FROM disrs d INNER JOIN staffs s ON d.staff_id = s.id ORDER BY d.sequence DESC LIMIT " +this.page.limit+ " OFFSET " + (pageInfo.offset * this.page.limit), []).then((disrs: any) => {
        let array = []
        console.log("DISRS", disrs)
        for (let x in disrs) {
          array.push({ staff_id: disrs[x].staff_id, thumbnail: (disrs[x].thumbnail) ? this.myFunctionProvider.sanitize(disrs[x].thumbnail) : "assets/images/bc5.jpg", sequence: disrs[x].sequence, id: disrs[x].id, created_date: moment(disrs[x].created_date, "YYYY-MM-DD HH:mm:ss").format("LL"), release_by: disrs[x].staff_name, dealer: disrs[x].dealer, dealer_id: disrs[x].dealer_id })
        }
        this.rows = [...array]
        this.myFunctionProvider.spinner(false, "")
      })
    })

  }

  presentActionSheet(s) {
    console.log("Selected", this.selected)
    let buttons = []
    if (1 /*this.myFunctionProvider.settings.logged_staff == s.staff_id*/) {
      buttons.push({
        text: 'Edit',
        icon: 'create',
        handler: () => {
          this.myFunctionProvider.nav.push("DisrCreatePage", { sequence: s.sequence, staff_id: s.staff_id, id: s.id, dealer: { id: s.dealer_id, name: s.dealer, thumbnail: this.myFunctionProvider.sanitize(s.thumbnail) } })
        }
      })

      buttons.push({
        icon: 'trash',
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          /* this.myFunctionProvider.toastConfirm("DR # " + s.dr, "Delete?", "fa fa-trash").then((b: any) => {
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
          }) */
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
      title: 'What to do with Sequence # ' + s.sequence,
      buttons: buttons
    });
    actionSheet.present();
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

  add() {
    this.myFunctionProvider.dbQuery("SELECT id, name, thumbnail FROM staffs WHERE role_id = ?", [3]).then((staffs: any) => {
      console.log("dealers", staffs)
      for (let x in staffs) {
        staffs[x].thumbnail = (staffs[x].thumbnail) ? this.myFunctionProvider.sanitize(staffs[x].thumbnail) : "assets/images/bc5.jpg"
      }
      let m = this.modalCtrl.create("DealersListPage", { staffs: staffs });
      m.onDidDismiss(staff => {
        console.log(staff.id)
        this.navCtrl.push("DisrCreatePage", { dealer: staff })
      })

      m.present()
    })
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  ionViewWillEnter() {
    this.loadIt({ offset: 0 })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisrListPage');
  }

  menuBtn(e){
    console.log(e)
  }

}
