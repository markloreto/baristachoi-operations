import { SynchronizeProvider } from './../../providers/synchronize/synchronize';
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import swal from 'sweetalert2';
import * as moment from 'moment'
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  staffs: any = []
  updateStaffs: () => void
  loaded: boolean = false
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider,
    public events: Events,
    public menuCtrl: MenuController,
    private sync: SynchronizeProvider
  ) {
    this.loadList()
    this.updateStaffs = () => {
      this.loadList()
    }
    this.events.subscribe("sync_pull:done", this.updateStaffs)
    console.log("Settings", this.myFunctionProvider.settings)

  }

  loadList() {
    this.myFunctionProvider.spinner(true, "Retrieving List...")
    this.myFunctionProvider.dbQuery("SELECT staffs.*, roles.name AS role_name FROM staffs, roles WHERE staffs.role_id = roles.id AND roles.id = 4", []).then((staffs: any) => {
      this.myFunctionProvider.spinner(false, "")
      console.log("Staffs", staffs)

      if(staffs.length == 0){
        this.syncIt()
      }else{
        this.staffs = staffs
      }
    })
  }

  syncIt(){
    this.sync.syncPull(["roles", "staffs"])
  }

  login(staff) {
    let self = this
    swal({
      title: 'Password',
      text: "Please provide password for " + staff.name,
      input: 'password',
      showCancelButton: true,
      customClass: 'animated tada',
      confirmButtonText: 'Logged me in!',
      preConfirm: function (password) {
        return new Promise(function (resolve, reject) {
          if (password != self.myFunctionProvider.settings.passcode) {
            reject("Wrong Password!")
          } else {
            resolve()
          }
        });
      },
      allowOutsideClick: false
    }).then((password) => {
      console.log(password)
      this.myFunctionProvider.spinner(true, "")

      this.myFunctionProvider.dbQuery("SELECT data FROM settings WHERE id = 5", []).then((as: any) => {
        //todo: accountanble staff
        let accountable_staff = as[0].data
        if(accountable_staff == null)
          this.myFunctionProvider.firstTime = true
        this.myFunctionProvider.dbQueryBatch([
          ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 4]],
          ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 5]]
        ]).then(() => {
          this.menuCtrl.swipeEnable(true)
          this.navCtrl.setRoot("HomePage")

          this.myFunctionProvider.setSettings().then((settings: any) => {
            this.events.publish("staff:login", settings)
          })
          setTimeout(() => {
            this.myFunctionProvider.spinner(false, "")
          }, 500)

        })
      })
    }).catch(e => {

    })

  }

  menuBtn(e){
    console.log(e)
    if(e.title === "Sync"){
      this.syncIt()
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillLeave() {
    this.events.unsubscribe('sync_pull:done', this.updateStaffs);
  }

}
