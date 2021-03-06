import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Events, App } from 'ionic-angular';
import { Component, ViewEncapsulation } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from './../../shared/menu-items/menu-items';
/* import { AppUpdate } from '@ionic-native/app-update'; */

/**
 * Generated class for the MySideMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var window
declare var cordova

@Component({
  selector: 'my-side-menu',
  templateUrl: 'my-side-menu.html',
  animations: [
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms easein-out', style({ opacity: 0 }))
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class MySideMenuComponent {

  navType: string; /* st1, st2(default), st3, st4 */
  themeLayout: string; /* vertical(default) */
  layoutType: string; /* dark, light */
  verticalPlacement: string; /* left(default), right */
  verticalLayout: string; /* wide(default), box */
  deviceType: string; /* desktop(default), tablet, mobile */
  verticalNavType: string; /* expanded(default), offcanvas */
  verticalEffect: string; /* shrink(default), push, overlay */
  vNavigationView: string; /* view1(default) */
  pcodedHeaderPosition: string; /* fixed(default), relative*/
  pcodedSidebarPosition: string; /* fixed(default), absolute*/

  innerHeight: string;
  windowWidth: number;

  navBarTheme: string; /* theme1, themelight1(default)*/
  activeItemTheme: string; /* theme1, theme2, theme3, theme4(default), ..., theme11, theme12 */

  isCollapsedSideBar: string;

  menuTitleTheme: string; /* theme1, theme2, theme3, theme4, theme5(default), theme6 */
  itemBorder: boolean;
  itemBorderStyle: string; /* none(default), solid, dotted, dashed */
  subItemBorder: boolean;
  subItemIcon: string; /* style1, style2, style3, style4, style5, style6(default) */
  dropDownIcon: string; /* style1(default), style2, style3 */
  configOpenRightBar: string;
  isSidebarChecked: boolean;
  isHeaderChecked: boolean;

  staff: any
  myMenu: any = []


  constructor(
    public menuItems: MenuItems,
    public events: Events,
    public myFunctionProvider: MyFunctionProvider,
    public app: App/* ,
    private appUpdate: AppUpdate */
  ) {

    let myMenu = this.menuItems.getAll()
    this.myMenu = myMenu
    console.log("myMenu", myMenu)

    this.myFunctionProvider.dbQuery("SELECT id, name FROM product_categories ORDER BY sequence", []).then((data: any) => {
      let cat = []
      for (let x in data) {
        cat.push({ /* badge: [{ type: "warning", value: 10 }], */ state: "ProductCategoryPage", name: data[x].name, data: { name: data[x].name, id: data[x].id } })
      }
      console.log("Categories", cat)
      this.myMenu[0].main[0].children = cat
    })

    this.events.subscribe("staff:login", (settings) => {
      this.loadIt(settings)
    })

    events.subscribe('menu:opened', () => {
      // your action here
    });

    this.navType = 'st2';
    this.themeLayout = 'vertical';
    this.vNavigationView = 'view1';
    this.verticalPlacement = 'left';
    this.verticalLayout = 'wide';
    this.deviceType = 'desktop';
    this.verticalNavType = 'expanded';
    this.verticalEffect = 'shrink';
    this.pcodedHeaderPosition = 'fixed';
    this.pcodedSidebarPosition = 'fixed';

    this.navBarTheme = 'themelight1';
    this.activeItemTheme = 'theme4';

    this.isCollapsedSideBar = 'no-block';

    this.menuTitleTheme = 'theme5';
    this.itemBorder = true;
    this.itemBorderStyle = 'none';
    this.subItemBorder = true;
    this.subItemIcon = 'style6';
    this.dropDownIcon = 'style1';
    this.isSidebarChecked = true;
    this.isHeaderChecked = true;

    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributes(this.windowWidth);
    this.loadIt(this.myFunctionProvider.settings)
  }

  loadIt(settings) {
    this.myFunctionProvider.dbQuery("SELECT staffs.*, roles.name AS role_name, staffs.thumbnail FROM staffs, roles WHERE staffs.id = ? AND roles.id = staffs.role_id", [settings.logged_staff]).then((staff: any) => {
      console.log("Logged User", staff)
      this.staff = staff[0]
    })
  }

  checkUpdates() {
    let updateUrl = 'https://www.dropbox.com/s/u789jjiowrji0cn/baristachoi_version.xml?dl=1';
    let self = this
    //AppUpdate.checkAppUpdate(updateUrl);
    window.AppUpdate.checkAppUpdate((c) => { self.myFunctionProvider.presentToast(c.msg, "") }, (c) => { self.myFunctionProvider.presentToast(c.msg, "") }, updateUrl);
    /* this.myFunctionProvider.spinner(true, "Checking...")
    const updateUrl = 'https://www.dropbox.com/s/u789jjiowrji0cn/baristachoi_version.xml?dl=1';
    this.appUpdate.checkAppUpdate(updateUrl).then(() => { console.log('Update available'); this.myFunctionProvider.spinner(false, "") }).catch(() => {
      this.myFunctionProvider.spinner(false, "")
    }) */
  }

  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
    /* menu responsive */
    this.windowWidth = event.target.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType === 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setMenuAttributes(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'tablet';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
  }

  toggleOpenedSidebar() {
    this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
  }

  clickFunction(item) {
    console.log(item)
    this.myFunctionProvider.spinner(true, "Please wait")
    console.log("stack: ", this.myFunctionProvider.nav.length())

    if (typeof item.data !== "undefined") {
      this.myFunctionProvider.menuCtrl.close()
      this.myFunctionProvider.nav.push("ProductCategoryPage", item.data)
    } else {
      this.myFunctionProvider.menuCtrl.close()
      if (this.myFunctionProvider.nav.length() > 1) {
        this.myFunctionProvider.nav.setRoot("HomePage").then(() => {
          this.myFunctionProvider.spinner(true, "Please wait")
          this.myFunctionProvider.nav.push(item.state, (typeof item.data !== "undefined") ? item.data : {})
        })
      } else {
        this.myFunctionProvider.nav.push(item.state, (typeof item.data !== "undefined") ? item.data : {})
      }
    }
  }

  openSettings() {
    this.myFunctionProvider.menuCtrl.close()
    this.myFunctionProvider.spinner(true, "Please wait")
    this.myFunctionProvider.nav.push("SettingsPage")
  }

  logout() {
    this.events.publish("staff:logout")
  }

}
