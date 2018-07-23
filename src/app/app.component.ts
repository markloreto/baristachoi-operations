import { MyFunctionProvider } from './../providers/my-function/my-function';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Menu, Nav, Events, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';
import { Deeplinks } from '@ionic-native/deeplinks';

declare var window;

@Component({
  templateUrl: 'app.html',
  providers: [MyFunctionProvider]
})
export class MyApp {
  spinner: boolean = true
  spinnerMessage: string = ""
  rootPage:any = "";
  pages = [
    { title: 'Home', component: "LoginPage" },
  ];
  menuSlide: boolean = false

  @ViewChild('content') content: NavController;
  @ViewChild(Menu) menu: Menu;
  @ViewChild(Nav) nav: Nav;

  newSMS: (result: any) => void
  constructor(
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private oneSignal: OneSignal,
    public events: Events,
    private backgroundMode: BackgroundMode,
    public ionicApp: IonicApp,
    public myFunctionProvider: MyFunctionProvider,
    private network: Network,
    public menuCtrl: MenuController,
    private deeplinks: Deeplinks
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.deeplinks.routeWithNavController(this.nav, {
        /* '/load/:depot_id/:sequence/:staff_id/:dealer_id/:items': "SyncPage" */
      }).subscribe(match => {
        // match.$route - the route we matched, which is the matched entry from the arguments to route()
        // match.$args - the args passed in the link
        // match.$link - the full link data
        console.log('Successfully matched route', match);
        if(match.$link.host == "load"){
          let args = match.$link.path.split("/");
          console.log(args)
        }
      }, nomatch => {
        // nomatch.$link - the full link data
        console.error('Got a deeplink that didn\'t match', nomatch);
      });

      this.oneSignal.startInit('ede7798c-0b4e-4b5f-815d-00829678734f', '233348829004');

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe((jsonData) => {
        console.log("handleNotificationReceived:", jsonData)
        this.events.publish("push:received", jsonData)
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
        console.log("handleNotificationOpened:", jsonData)
        // do something when a notification is opened
        this.events.publish("push:open", jsonData)
      });

      this.oneSignal.endInit();

      this.backgroundMode.enable();

      //back button
      this.platform.registerBackButtonAction(() => {
        console.log(this.nav.getActive().component.name)
        let nav = this.nav.getActive();
        this.myFunctionProvider.spinner(false, "")
        if(nav != null){

          let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() ||
          this.ionicApp._toastPortal.getActive() ||
          this.ionicApp._overlayPortal.getActive();

          if (activePortal) {
            activePortal.dismiss();
            activePortal.onDidDismiss(() => {  });
            return;
          }

          else{
            if(this.nav.canGoBack() || nav && nav.isOverlay) {
              this.nav.pop();
            } else {
              if(this.nav.getActive().component.name == "HomePage"){
                //this.appMinimize.minimize()
              }
              else{
                //this.nav.setRoot("HomePage")
              }
            }
          }
        }
      });

      this.myFunctionProvider.nav = this.nav
      this.myFunctionProvider.menuCtrl = this.menuCtrl

      this.events.subscribe("staff:logout", () => {
        this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [null, 4]).then(() => {
          this.menuCtrl.close()
          this.menuCtrl.swipeEnable(false)
          this.nav.setRoot("LoginPage")
        })
      })

      this.events.subscribe("staff:login", () => {
        this.menuSlide = true
      })

      this.events.subscribe("spinner:load", (spinner, message) => {
        this.spinner = spinner
        this.spinnerMessage = message
      })

      this.network.onDisconnect().subscribe(() => {
        console.log("Internet Disconnected")
        this.events.publish("network:disconnected")
      });

      this.network.onConnect().subscribe(() => {
        console.log("Internet connected")
        this.events.publish("network:connected")
      });

      //start SMS watch
      this.newSMS = (result: any) => {
        this.events.publish("sms:arrived", result)
      }
      this.watchSMS()

      this.myFunctionProvider.startDatabase().then(() => {
        this.myFunctionProvider.dbQuery("SELECT * FROM settings ORDER BY id ASC", []).then((settings: any) => {

          console.log("Settings", settings)
          this.spinner = false
          if(settings.length){
            if(this.myFunctionProvider.settings.logged_staff != null){
              this.menuSlide = true
              this.menuCtrl.swipeEnable(true)
              this.rootPage = "HomePage"
            }
            else{
              this.rootPage = "LoginPage"
            }
          }
          else
            this.rootPage = "StartupPage"
        })

      })

    });
  }

  watchSMS() {
    if (window.SMS) {
      window.SMS.startWatch(() => {
        console.log("startWatch");
      }, error => {
        console.log(error);
        console.log("error startWatch");
      });
    }
    document.addEventListener('onSMSArrive', this.newSMS);
  }

  menuOpened(){
    this.events.publish('menu:opened', '');
  }
}

