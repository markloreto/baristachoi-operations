var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import swal from 'sweetalert2';
import moment from 'moment';
/**
 * Generated class for the StartupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var StartupPage = /** @class */ (function () {
    function StartupPage(navCtrl, navParams, myFunctionProvider, events, openNativeSettings, androidPermissions) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.myFunctionProvider = myFunctionProvider;
        this.events = events;
        this.openNativeSettings = openNativeSettings;
        this.androidPermissions = androidPermissions;
        this.step2 = {
            showNext: true,
            showPrev: true
        };
        this.step3 = {
            showSecret: false
        };
        this.selectedDepot = 0;
        this.selectedDepotName = "";
        this.depotList = [];
        this.dateTimeValue = true;
        this.passcode = "1234";
        this.isCompleted = false;
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.READ_SMS, this.androidPermissions.PERMISSION.WRITE_CONTACTS, this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION]);
        this.internetConnection = function () {
            if (_this.depotList.length === 0)
                _this.loadList();
        };
        this.events.subscribe("network:connected", this.internetConnection);
        this.myFunctionProvider.checkInternetConnection().then(function (i) {
            if (i)
                _this.loadList();
            else {
                swal({
                    type: 'warning',
                    title: 'Oops...',
                    text: 'Failed to retrieve list of Depot... Please check your internet connection'
                });
            }
        });
    }
    StartupPage.prototype.chkDateTime = function () {
        var _this = this;
        if (!this.dateTimeValue) {
            this.openNativeSettings.open("date").then(function () {
                _this.dateTimeValue = true;
            });
        }
    };
    StartupPage.prototype.loadList = function () {
        var _this = this;
        this.myFunctionProvider.spinner(true, "Downloading List...");
        this.myFunctionProvider.APIGet("getDepot").then(function (data) {
            _this.myFunctionProvider.spinner(false, "");
            _this.depotList = data.data;
        });
    };
    StartupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad StartupPage');
    };
    StartupPage.prototype.openAjaxSwal = function () {
        var self = this;
        swal({
            title: 'Key Required',
            input: 'password',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function (key) {
                return new Promise(function (resolve, reject) {
                    self.myFunctionProvider.APIGet("checkKey?id=" + self.selectedDepot + "&key=" + key).then(function (data) {
                        if (data.data) {
                            resolve();
                        }
                        else {
                            reject("Wrong Key");
                        }
                    });
                });
            },
            allowOutsideClick: false
        }).then(function (email) {
            swal({
                type: 'success',
                title: 'Correct Key!'
            });
        }).catch(function (e) {
            self.selectedDepot = 0;
            swal.showValidationError(e);
            swal.noop();
        });
    };
    StartupPage.prototype.selectDepot = function (ev) {
        console.log(ev);
        if (this.selectedDepot) {
            this.selectedDepotName = ev.name;
            this.openAjaxSwal();
        }
    };
    StartupPage.prototype.onStep1Next = function (event) {
        var _this = this;
        this.dateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        try {
            clearInterval(this.interval);
        }
        catch (e) {
        }
        this.interval = setInterval(function () {
            _this.dateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        }, 1000);
    };
    StartupPage.prototype.onStep2Next = function (event) {
        console.log(event);
    };
    StartupPage.prototype.onStep3Next = function (event) {
        console.log('Step3 - Next');
    };
    StartupPage.prototype.onComplete = function (event) {
        var _this = this;
        console.log(event);
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            customClass: 'animated tada',
            confirmButtonText: 'Yes, proceed to login screen!'
        }).then(function (result) {
            console.log(result);
            if (result) {
                _this.myFunctionProvider.spinner(true, "");
                _this.myFunctionProvider.dbQueryBatch([
                    ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [1, "time_in", _this.myFunctionProvider.getTimestamp()]],
                    ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [2, "depot", JSON.stringify({ name: _this.selectedDepotName, id: _this.selectedDepot })]],
                    ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [3, "passcode", _this.passcode]],
                    ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [4, "logged_staff", null]],
                    ["INSERT OR REPLACE INTO settings VALUES (?, ?, ?)", [5, "accountable_staff", _this.passcode]]
                ]).then(function () {
                    _this.myFunctionProvider.setSettings();
                    _this.isCompleted = true;
                    _this.navCtrl.setRoot("LoginPage");
                    _this.myFunctionProvider.spinner(false, "");
                });
            }
        }).catch(function (e) {
            _this.isCompleted = false;
        });
    };
    StartupPage.prototype.onStepChanged = function (step) {
        console.log('Changed to ' + step.title);
    };
    StartupPage.prototype.ionViewWillLeave = function () {
        this.events.unsubscribe('network:disconnected', this.internetConnection);
    };
    StartupPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-startup',
            templateUrl: 'startup.html',
            encapsulation: ViewEncapsulation.None,
            animations: [
                trigger('listAnimation', [
                    transition('* => *', [
                        query(':leave', [
                            stagger(100, [
                                animate('0.8s', style({ opacity: 0 }))
                            ])
                        ], { optional: true }),
                        query(':enter', [
                            style({ opacity: 0 }),
                            stagger(100, [
                                animate('0.8s', style({ opacity: 1 }))
                            ])
                        ])
                    ])
                ])
            ]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MyFunctionProvider,
            Events,
            OpenNativeSettings,
            AndroidPermissions])
    ], StartupPage);
    return StartupPage;
}());
export { StartupPage };
//# sourceMappingURL=startup.js.map