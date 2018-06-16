var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HomePage } from './../pages/home/home';
import { MyFunctionProvider } from './../providers/my-function/my-function';
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, Menu, Nav, Events, IonicApp, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, oneSignal, events, backgroundMode, ionicApp, myFunctionProvider, network, menuCtrl) {
        var _this = this;
        this.platform = platform;
        this.oneSignal = oneSignal;
        this.events = events;
        this.backgroundMode = backgroundMode;
        this.ionicApp = ionicApp;
        this.myFunctionProvider = myFunctionProvider;
        this.network = network;
        this.menuCtrl = menuCtrl;
        this.spinner = true;
        this.spinnerMessage = "";
        this.rootPage = "";
        this.pages = [
            { title: 'Home', component: "LoginPage" },
        ];
        this.menuSlide = false;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.oneSignal.startInit('ede7798c-0b4e-4b5f-815d-00829678734f', '233348829004');
            _this.oneSignal.inFocusDisplaying(_this.oneSignal.OSInFocusDisplayOption.Notification);
            _this.oneSignal.handleNotificationReceived().subscribe(function (jsonData) {
                console.log("handleNotificationReceived:", jsonData);
                _this.events.publish("push:received", jsonData);
                // do something when notification is received
            });
            _this.oneSignal.handleNotificationOpened().subscribe(function (jsonData) {
                console.log("handleNotificationOpened:", jsonData);
                // do something when a notification is opened
                _this.events.publish("push:open", jsonData);
            });
            _this.oneSignal.endInit();
            _this.backgroundMode.enable();
            //back button
            _this.platform.registerBackButtonAction(function () {
                console.log(_this.nav.getActive().component.name);
                var nav = _this.nav.getActive();
                if (nav != null) {
                    var activePortal = _this.ionicApp._loadingPortal.getActive() ||
                        _this.ionicApp._modalPortal.getActive() ||
                        _this.ionicApp._toastPortal.getActive() ||
                        _this.ionicApp._overlayPortal.getActive();
                    if (activePortal) {
                        activePortal.dismiss();
                        activePortal.onDidDismiss(function () { });
                        return;
                    }
                    else {
                        if (_this.nav.canGoBack() || nav && nav.isOverlay) {
                            _this.nav.pop();
                        }
                        else {
                            if (_this.nav.getActive().component.name == "TabsPage") {
                                //this.appMinimize.minimize()
                            }
                            else {
                            }
                        }
                    }
                }
            });
            _this.events.subscribe("staff:logout", function () {
                _this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [null, 4]).then(function () {
                    _this.menuCtrl.close();
                    _this.menuCtrl.swipeEnable(false);
                    _this.nav.setRoot("LoginPage");
                });
            });
            _this.events.subscribe("staff:login", function () {
                _this.menuSlide = true;
            });
            _this.events.subscribe("spinner:load", function (spinner, message) {
                _this.spinner = spinner;
                _this.spinnerMessage = message;
            });
            _this.network.onDisconnect().subscribe(function () {
                _this.events.publish("network:disconnected");
            });
            _this.network.onConnect().subscribe(function () {
                _this.events.publish("network:connected");
            });
            //start SMS watch
            _this.newSMS = function (result) {
                _this.events.publish("sms:arrived", result);
            };
            _this.watchSMS();
            _this.myFunctionProvider.startDatabase().then(function () {
                _this.myFunctionProvider.dbQuery("SELECT * FROM settings ORDER BY id ASC", []).then(function (settings) {
                    console.log("Settings", settings);
                    _this.spinner = false;
                    if (settings.length) {
                        if (_this.myFunctionProvider.settings.logged_staff != null) {
                            _this.menuSlide = true;
                            _this.menuCtrl.swipeEnable(true);
                            _this.rootPage = HomePage;
                        }
                        else {
                            _this.rootPage = "LoginPage";
                        }
                    }
                    else
                        _this.rootPage = "StartupPage";
                });
            });
        });
    }
    MyApp.prototype.watchSMS = function () {
        if (window.SMS) {
            window.SMS.startWatch(function () {
                console.log("startWatch");
            }, function (error) {
                console.log(error);
                console.log("error startWatch");
            });
        }
        document.addEventListener('onSMSArrive', this.newSMS);
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", NavController)
    ], MyApp.prototype, "content", void 0);
    __decorate([
        ViewChild(Menu),
        __metadata("design:type", Menu)
    ], MyApp.prototype, "menu", void 0);
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html',
            providers: [MyFunctionProvider]
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            OneSignal,
            Events,
            BackgroundMode,
            IonicApp,
            MyFunctionProvider,
            Network,
            MenuController])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map