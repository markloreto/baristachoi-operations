var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from '@ionic-native/sqlite';
import { Events } from 'ionic-angular';
import moment from 'moment';
var MyFunctionProvider = /** @class */ (function () {
    function MyFunctionProvider(http, sqlite, events) {
        this.http = http;
        this.sqlite = sqlite;
        this.events = events;
        this.ngrok = "https://c8fcef65.ngrok.io";
        console.log('Hello MyFunctionProvider Provider');
    }
    // Database
    MyFunctionProvider.prototype.startDatabase = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.sqlite.create({
                name: 'data.db',
                location: 'default'
            }).then(function (db) {
                console.log("DB Initialized");
                _this.db = db;
                //this.myFunctionProvider.dbQuery("DROP TABLE IF EXISTS staffs", [])
                _this.dbQuery("CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, name TEXT, data TEXT)", []);
                _this.dbQuery("CREATE TABLE IF NOT EXISTS staffs (id INTEGER PRIMARY KEY, depot_id INT, name TEXT, photo TEXT, thumbnail TEXT, role_id INT, created_at TEXT, updated_at TEXT, sync INT)", []);
                _this.dbQuery("CREATE TABLE IF NOT EXISTS roles (id INTEGER PRIMARY KEY, name TEXT)", []);
                _this.setSettings();
                resolve();
            }).catch(function (e) { return console.log(e); });
        });
    };
    MyFunctionProvider.prototype.setSettings = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dbQuery("SELECT * FROM settings", []).then(function (settings) {
                if (settings.length) {
                    _this.settings = {
                        time_in: parseInt(settings[0].data),
                        depot: JSON.parse(settings[1].data),
                        passcode: settings[2].data,
                        logged_staff: settings[3].data,
                        accountable_staff: settings[4].data
                    };
                    resolve(_this.settings);
                }
                else {
                    resolve();
                }
            });
        });
    };
    MyFunctionProvider.prototype.dbQuery = function (q, v) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.executeSql(q, v).then(function (data) {
                var ar = [];
                for (var x = 0; x < data.rows.length; x++) {
                    ar.push(data.rows.item(x));
                }
                if (data.rowsAffected)
                    resolve(data.insertId);
                else
                    resolve(ar);
            }, function (error) {
                console.log(error);
                reject(error);
            });
        });
    };
    //DB
    MyFunctionProvider.prototype.dbQueryBatch = function (q) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.sqlBatch(q).then(function (data) {
                resolve(data);
            }, function (error) {
                console.log(error);
                reject(error);
            });
        });
    };
    //Networks
    MyFunctionProvider.prototype.APIGet = function (api) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImY3MTZmMGI4MGRiOWVmODRhN2JjMDcyMTBkYjZkM2UzYTI4YWUwZjdjOGUyNTU4MTIwYmQyZDQzYjYxMjI1N2UxN2IyNGRkNTFiMTY0MDk3In0.eyJhdWQiOiIzIiwianRpIjoiZjcxNmYwYjgwZGI5ZWY4NGE3YmMwNzIxMGRiNmQzZTNhMjhhZTBmN2M4ZTI1NTgxMjBiZDJkNDNiNjEyMjU3ZTE3YjI0ZGQ1MWIxNjQwOTciLCJpYXQiOjE1MjgzODIyNjEsIm5iZiI6MTUyODM4MjI2MSwiZXhwIjoxNTU5OTE4MjYxLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.RVcRU3SmGjpoK7Nh5QfDqFkowl23KgdQHZJFLM77biRgslyhjIpBOeqohBuFzWnnrNWY_F0FhwCfQj8G0SWRRoNeltnXpMq-AB3VTwMuCPMQlIml1ggwEM2aWdhRO_n_vpljdtaZkMvQw2lYnUSkeUgbqAp4vX4UlTe9UR0KH0cXHv_qzQbRGlRI7Yka7py9FU-xZGCM19NosLExGcNtPzRO9DK3cA7XUEfml7yVUbmHCXwpcRng8JDnfGXfp1zBiOBjM_7PCfqtnQ6eFT7gR3gyJQ_hTwx3YyAaeeipeemRPe7ao3OA2VsmzlR724yQPBThwU6WXXZEIZG3R5hAI3CmdpcmGMdSXVI2aSFba4R4AsSRtGkZrM8xFh4xXP6PsZQiNjWiG7GmghndGByJs_qLOmRkT14uGwdngrg5HX973WAdgp-ptb_H-IHtyF0k5f6X3vnMbZMNgvAMbFlUg67jYdpQU1zQvNwkeo9rgeaf8KddE-ymhKSOrRDRCp6yTZSrzBg8RBDdlA6CK-UW3xq09vWu038YCYSplT38SkMCrC_DAZOQ7OwqOdwMvvl0-1J-9K8V-cNkTCtSvTZfXhCQczxS1i1H7tqNj0Q3BoIAaAdng0h_ctwGXsVGD4YT8zdpobpFXwfb2zLX6tD0-C6A95-kTSs0LODgZYYEUWo');
            var options = new RequestOptions({ headers: headers });
            _this.http.get(_this.ngrok + "/baristachoi-server2/public/api/" + api, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                console.log("Data from server", data);
                resolve(data);
            }, function (error) {
                console.log(error); // Error getting the data
                reject(error);
            });
        });
    };
    MyFunctionProvider.prototype.checkInternetConnection = function () {
        return new Promise(function (resolve, reject) {
            window.WifiWizard2.isConnectedToInternet().then(function (internet) {
                resolve(true);
            }).catch(function (e) {
                resolve(false);
            });
        });
    };
    //Misc
    MyFunctionProvider.prototype.spinner = function (spinner, message) {
        this.events.publish("spinner:load", spinner, message);
    };
    MyFunctionProvider.prototype.getTimestamp = function () {
        return moment().format("x");
    };
    MyFunctionProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            SQLite,
            Events])
    ], MyFunctionProvider);
    return MyFunctionProvider;
}());
export { MyFunctionProvider };
//# sourceMappingURL=my-function.js.map