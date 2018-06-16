var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HomePage } from './../home/home';
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import swal from 'sweetalert2';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, myFunctionProvider, events, menuCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.myFunctionProvider = myFunctionProvider;
        this.events = events;
        this.menuCtrl = menuCtrl;
        this.staffs = [];
        this.loaded = false;
        this.loadList();
        this.internetConnection = function () {
        };
        this.events.subscribe("network:connected", this.internetConnection);
        console.log("Settings", this.myFunctionProvider.settings);
    }
    LoginPage.prototype.updateStaffs = function (array) {
        var _this = this;
        this.myFunctionProvider.APIGet("getRoles").then(function (result) {
            var d = result.data;
            var a = [];
            for (var x in d) {
                a.push(["INSERT OR REPLACE INTO roles (id, name) VALUES (?, ?)", [d[x].id, d[x].display_name]]);
            }
            _this.myFunctionProvider.dbQueryBatch(a).then(function (rolesB) {
                console.log("roles batch", rolesB);
                var b = [];
                for (var x in array) {
                    b.push(["INSERT OR REPLACE INTO staffs (id, depot_id, name, photo, thumbnail, role_id, created_at, updated_at, sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [array[x].id, array[x].depot_id, array[x].name, array[x].photo, array[x].thumbnail, array[x].role_id, array[x].created_at, array[x].updated_at, _this.myFunctionProvider.getTimestamp()]]);
                }
                _this.myFunctionProvider.dbQueryBatch(b).then(function (staffsB) {
                    console.log("staff batch", staffsB);
                    _this.loaded = true;
                    _this.loadList();
                });
            });
        });
    };
    LoginPage.prototype.loadList = function () {
        var _this = this;
        this.myFunctionProvider.dbQuery("SELECT staffs.*, roles.name AS role_name FROM staffs, roles WHERE staffs.role_id = roles.id", []).then(function (staffs) {
            console.log("Staffs", staffs);
            _this.staffs = staffs;
            if (!_this.loaded) {
                _this.myFunctionProvider.checkInternetConnection().then(function (i) {
                    if (i) {
                        if (!staffs.length)
                            _this.myFunctionProvider.spinner(true, "Retrieving List...");
                        _this.myFunctionProvider.APIGet("staff").then(function (result) {
                            console.log(result);
                            if (!staffs.length)
                                _this.myFunctionProvider.spinner(false, "");
                            if (result.data.length)
                                _this.updateStaffs(result.data);
                        });
                    }
                    else {
                        if (!staffs.length)
                            swal({
                                type: 'warning',
                                title: 'Oops...',
                                text: 'Failed to retrieve the list... Please check your internet connection'
                            });
                    }
                });
            }
        });
    };
    LoginPage.prototype.login = function (staff) {
        var _this = this;
        var self = this;
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
                        reject("Wrong Password!");
                    }
                    else {
                        resolve();
                    }
                });
            },
            allowOutsideClick: false
        }).then(function (password) {
            console.log(password);
            _this.myFunctionProvider.spinner(true, "");
            _this.myFunctionProvider.dbQuery("SELECT data FROM settings WHERE id = 5", []).then(function (as) {
                //todo: accountanble staff
                _this.myFunctionProvider.dbQueryBatch([
                    ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 4]],
                    ["UPDATE settings SET data = ? WHERE id = ?", [staff.id, 5]]
                ]).then(function () {
                    _this.menuCtrl.swipeEnable(true);
                    _this.navCtrl.setRoot(HomePage);
                    _this.myFunctionProvider.setSettings().then(function (settings) {
                        _this.events.publish("staff:login", settings);
                    });
                    setTimeout(function () {
                        _this.myFunctionProvider.spinner(false, "");
                    }, 500);
                });
            });
        }).catch(function (e) {
        });
    };
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LoginPage');
    };
    LoginPage.prototype.ionViewWillLeave = function () {
        this.events.unsubscribe('network:disconnected', this.internetConnection);
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MyFunctionProvider,
            Events,
            MenuController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map