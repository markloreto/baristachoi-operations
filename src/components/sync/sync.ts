import { Component } from '@angular/core';
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { IziToastSettings, default as iziToast } from 'izitoast';
import * as _ from 'lodash';
import * as moment from 'moment'
import swal from 'sweetalert2';
/**
 * Generated class for the SyncComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'sync',
  templateUrl: 'sync.html'
})
export class SyncComponent {
  syncPullStep: number = 0
  syncPullTotalRecord: number = 0
  syncPullTables: any = []

  syncPushTables: any = []
  syncPushStep: number = 0
  syncPushTotalRecord: number = 0
  syncCounter: number = 0

  syncDeleteTotalRecord: number = 0

  progressBars: any = []

  lastSync: any = ""

  all: boolean = false

  withConnect: any = {
    "staffs": { alias: "Staffs", col: "", tables: [], reference: [] },
    "roles": { alias: "Roles", col: "", tables: [], reference: [] },
    "products": { alias: "Products", col: "product_id", tables: ["inventories", "endorsement_items"], reference: [] },
    "product_categories": { alias: "Product Categories", col: "", tables: [], reference: [] },
    "measurement_units": { alias: "Measurement Units", col: "", tables: [], reference: [] },
    "attachments": { alias: "Attachments", col: "", tables: [], reference: [] },
    "delivery_receipts": { alias: "Delivery Receipts", col: "", tables: [], reference: ["inventories", "attachments"] },
    "inventories": { alias: "Inventories", col: "", tables: [], reference: [] },
    "modules": { alias: "Modules", col: "", tables: [], reference: [] },
    "disrs": { alias: "Daily Inventory Sales Report", col: "", tables: [], reference: ["inventories"] },
    "endorsements": { alias: "Endorsements", col: "", tables: [], reference: ["endorsement_items"] },
    "endorsement_items": { alias: "Endorsements Items", col: "", tables: [], reference: [] },
  }
  constructor(
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.myFunctionProvider.spinner(false, "")
    this.lastSync = (this.myFunctionProvider.settings.last_push_sync) ? moment(this.myFunctionProvider.settings.last_push_sync).format("lll") : "None"
  }

  diffDays() {
    let start = moment(this.myFunctionProvider.settings.last_push_sync);
    let end = moment(parseInt(this.myFunctionProvider.getTimestamp()));
    return end.to(start);
  }

  //Sync
  syncNow(all) {
    this.all = all
    this.myFunctionProvider.checkInternetConnection().then((i: any) => {
      if (i) {
        this.progressBars = []
        this.myFunctionProvider.synching = true
        this.syncPull(["staffs", "roles", "products", "product_categories", "measurement_units", "attachments", "delivery_receipts", "inventories", "modules", "endorsements", "endorsement_items", "disrs"], this.all)
      }
      else {
        swal({
          type: 'warning',
          title: 'Internet Connection Problem',
          text: 'Failed to Synchronize... Please check your internet connection'
        })
      }
    })
  }

  cloudInsert(table, data, updates) {
    return new Promise((resolve) => {
      console.log("Inserting Data", table, data)
      console.log("Records to omit", updates)
      let obj = ""
      let qm = ""
      let values = []
      let columns //= _.omit(data, ['created_at', 'updated_at', 'deleted_at'])
      let v
      let batch = []
      let con = 0
      let index

      for (let n in data) {
        index = _.findIndex(this.progressBars, { 'table': this.withConnect[this.syncPullTables[this.syncPullStep]].alias, icon: "cloud-download" });
        this.progressBars[index].percent = (this.syncCounter / this.syncPullTotalRecord) * 100
        console.log("Index", index)
        console.log("Progress", this.progressBars)
        //omit here

        if (_.includes(updates, parseInt(n))) {
          console.log("is now omitted", data[n])
          continue
        }

        con = 0
        obj = ""
        qm = ""
        values = []
        columns = _.omit(data[n], ['created_at', 'updated_at', 'deleted_at', 'mapper_id'])

        for (let x in columns) {
          obj += x + ","
          qm += "?,"
          v = (columns[x] == "null") ? null : columns[x]
          values.push(v)
          if (x == "shareable" && (v != this.myFunctionProvider.settings.depot.id && v != null))
            con++
        }

        if (con)
          continue;

        obj = obj.slice(0, -1);
        qm = qm.slice(0, -1);

        batch.push(["INSERT OR REPLACE INTO " + table + " (" + obj + ") VALUES (" + qm + ")", values])
      }

      this.myFunctionProvider.dbQueryBatch(batch).then(() => {
        resolve()
      })
    })
  }

  syncPullCheckforUpdates(table, data, inc, updates = [], all, skip) {
    if (inc < data.length) {
      this.myFunctionProvider.dbQuery("SELECT * FROM " + table + " WHERE id = ?", [data[inc].id]).then((rec: any) => {
        if (rec.length) {
          let record = rec[0]
          let syncVal = record.sync
          let data_omitted = _.omit(data[inc], ['created_at', 'updated_at', 'deleted_at', 'mapper_id'])
          let record_ommited = _.omit(record, ['sync'])

          if (syncVal == 3) {
            let diff = this.difference(record_ommited, data_omitted)
            console.log(diff)

            let message = ""

            for (let x in diff) {
              message += "<br> <strong>" + x + "</strong> From <strong style='color: red'>" + record_ommited[x] + "</strong> To <strong style='color: red'>" + data_omitted[x] + "</strong>"
              console.log("From", record_ommited[x])
              console.log("To", data_omitted[x])
            }

            this.myFunctionProvider.toastConfirm("Conflict Data from cloud", "Would you like to receive these changes on " + this.withConnect[table].alias + " table? with an ID of " + record.id + "<br>" + message, "fa fa-warning", "", "red", 0).then((b) => {
              if (b) {
                this.syncPullCheckforUpdates(table, data, inc + 1, updates, all, skip)
              } else {
                updates.push(inc)
                this.syncPullCheckforUpdates(table, data, inc + 1, updates, all, skip)
              }
            })
          } else {
            this.syncPullCheckforUpdates(table, data, inc + 1, updates, all, skip)
          }

          console.log()
        } else {
          this.syncPullCheckforUpdates(table, data, inc + 1, updates, all, skip)
        }
      })
    }

    else {
      this.cloudInsert(table, data, updates).then(() => {
        this.syncPullPost(table, all, skip + 10)

      })
    }
  }

  syncPullPost(table, all, skip) {
    this.myFunctionProvider.APIPost("syncPull", { table: table, all: all, skip: skip, staff_id: this.myFunctionProvider.settings.logged_staff, depot_id: this.myFunctionProvider.settings.depot.id }).then((data: any) => {
      if (data.data.length) {
        this.syncCounter += data.data.length
        this.syncPullCheckforUpdates(table, data.data, 0, [], all, skip)
      } else {
        this.syncPullStep++
        this.syncPull(this.syncPullTables, all)
      }
    }).catch(() => {
      this.myFunctionProvider.synching = false
      this.progressBars = []
      iziToast.error({
        title: "An Error Occurred",
        message: "Internal Server Error",
      });
    })
  }

  syncPullCount(table, all) {
    return new Promise((resolve) => {
      this.myFunctionProvider.APIPost("syncPullCount", { table: table, all: all, staff_id: this.myFunctionProvider.settings.logged_staff, depot_id: this.myFunctionProvider.settings.depot.id }).then((data: any) => {
        //Percent Loader
        console.log("total records to pull", table, data)
        this.syncPullTotalRecord = data.data
        resolve()
      })
    })
  }

  syncPull(tables, all = false) {
    this.syncPullTables = tables
    this.syncCounter = 0
    /* iziToast.info({
      title: 'Synching Started',
      message: tables.length + ' Tables to Pull...',
      icon: 'fa fa-hourglass-start'
    }); */

    if (this.syncPullStep < tables.length) {
      this.syncPullCount(tables[this.syncPullStep], all).then(() => {
        if (this.syncPullTotalRecord) {
          this.progressBars.push({ table: this.withConnect[tables[this.syncPullStep]].alias, percent: 0, icon: "cloud-download" })
          console.log(this.progressBars)
          this.syncPullPost(tables[this.syncPullStep], all, 0)
        }
        else {
          iziToast.info({
            title: 'Skipping ' + this.withConnect[tables[this.syncPullStep]].alias,
            message: "No Records to Pull",
            icon: 'fa fa-info'
          });

          this.syncPullStep++
          this.syncPull(this.syncPullTables, all)
        }
      })
    } else {
      //sync done
      console.log("Done Pull Synch")
      this.syncPullStep = 0
      this.syncPullTotalRecord = 0

      this.myFunctionProvider.dbQuery("SELECT * FROM settings WHERE id = ?", [6]).then((set: any) => {
        if (set[0].data == "0") {
          this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [this.myFunctionProvider.getTimestamp(), 6]).then(() => {
            console.log("Updated last pull sync from intial value")
          })
        }
      })

      this.syncPush(["products", "delivery_receipts", "disrs", "inventories", "attachments", "endorsements", "endorsement_items", "staffs"], false)
    }
  }

  syncPushPost(table, all) {
    if (!all) {
      this.myFunctionProvider.dbQuery("SELECT * FROM " + table + " WHERE sync IS NULL OR sync = 1 OR sync = 3 LIMIT 1", []).then((data: any) => {
        if (data.length) {
          console.log("Data to push", data)
          data[0].id = data[0].id.toString()
          this.myFunctionProvider.dbQuery("UPDATE " + table + " SET sync = ? WHERE id = ?", [1, data[0].id]).then(() => {
            this.myFunctionProvider.APIPost("syncPush", { table: table, staff_id: this.myFunctionProvider.settings.logged_staff, record: data[0] }).then((syncData: any) => {
              console.log("Sync Push Data", syncData)
              if (syncData.data) {
                this.myFunctionProvider.dbQuery("UPDATE " + table + " SET id = ?, sync = 2 WHERE id = ?", [syncData.data, data[0].id]).then(() => {
                  this.syncCounter++
                  let index = _.findIndex(this.progressBars, { 'table': this.withConnect[this.syncPushTables[this.syncPushStep]].alias, icon: "cloud-upload" });
                  this.progressBars[index].percent = (this.syncCounter / this.syncPushTotalRecord) * 100
                  if (typeof this.withConnect[table] != "undefined") {
                    console.log("With Connect", this.withConnect[table])
                    this.relationId(this.withConnect[table], syncData.data, data[0].id).then(() => {
                      this.syncPushPost(table, all)
                    })
                  }
                  else {
                    this.syncPushPost(table, all)
                  }
                })
              }
            }).catch(() => {
              this.myFunctionProvider.synching = false
              this.progressBars = []
              iziToast.error({
                title: "An Error Occurred",
                message: "Internal Server Error",
              });
            })
          })
        } else {
          this.syncPushStep++
          this.syncPush(this.syncPushTables, all)
        }
      })
    }

  }

  syncPush(tables, all = false) {
    this.syncCounter = 0
    this.syncPushTables = tables

    if (this.syncPushStep < tables.length) {
      console.log("Reading table", tables[this.syncPushStep])
      if (!all) {
        this.myFunctionProvider.dbQuery("SELECT COUNT(id) AS num FROM " + tables[this.syncPushStep] + " WHERE sync IS NULL OR sync = 1 OR sync = 3", []).then((data: any) => {
          console.log("Total Records to Push", tables[this.syncPushStep], data[0].num)
          this.syncPushTotalRecord = data[0].num
          if (data[0].num) {
            this.progressBars.push({ table: this.withConnect[tables[this.syncPushStep]].alias, percent: 0, icon: "cloud-upload" })
            this.syncPushPost(tables[this.syncPushStep], all)
          } else {
            iziToast.info({
              title: 'Skipping ' + this.withConnect[tables[this.syncPushStep]].alias,
              message: "No Records to Push",
              icon: 'fa fa-info'
            });

            this.syncPushStep++
            this.syncPush(this.syncPushTables, all)
          }

        })
      } else {
        //Push all
      }
    } else {
      console.log("Done Push Sync")
      this.syncPushStep = 0
      this.syncPushTotalRecord = 0
      this.syncDelete()
    }
  }

  syncDone() {
    console.log("Done Remove Sync")
    this.myFunctionProvider.synching = false
    this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [this.myFunctionProvider.getTimestamp(), 6]).then(() => {
      this.myFunctionProvider.setSettings().then(() => {
        this.lastSync = moment(this.myFunctionProvider.settings.last_push_sync).format("lll")
        iziToast.success({
          title: 'Synching Finished',
          message: '',
          icon: 'fa fa-cloud'
        });
      })

    })
  }

  syncDeletePost() {
    let index = _.findIndex(this.progressBars, { 'table': "Omits", icon: "cloud-circle" });
    this.myFunctionProvider.dbQuery("SELECT * FROM remove_sync", []).then((data: any) => {
      console.log("Remove Sync Data", data)
      this.myFunctionProvider.APIPost("syncDelete", { staff_id: this.myFunctionProvider.settings.logged_staff, records: data }).then((syncData: any) => {
        this.myFunctionProvider.dbQuery("DELETE FROM remove_sync", [])
        if (syncData.data.length) {
          let sd = syncData.data
          let array = []
          for (let x in sd) {
            array.push(["DELETE FROM " + sd[x].name + " WHERE id = ?", [sd[x].data_id]]);
          }

          this.myFunctionProvider.dbQueryBatch(array).then(() => {
            this.progressBars[index].percent = 100
            this.syncDone()
          })
        } else {
          this.progressBars[index].percent = 100
          this.syncDone()
        }
      })
    })
  }

  syncDelete() {
    console.log("sync delete started")
    this.syncCounter = 0
    this.myFunctionProvider.dbQuery("SELECT COUNT(id) AS num FROM remove_sync", []).then((data: any) => {
      console.log("Remove Sync Count", data)
      this.progressBars.push({ table: "Omits", percent: 0, icon: "cloud-circle" })
      this.syncDeletePost()
    })
  }

  pullAllChange() {
    if (this.all) {
      this.myFunctionProvider.dbQuery("SELECT COUNT(id) AS num FROM remove_sync", []).then((data: any) => {
        if (data[0].num) {
          this.all = false
          iziToast.warning({
            title: 'Pull All Disabled',
            message: 'Synch the items you\'ve removed first before using pull all feature',
            icon: 'fa fa-warning'
          });
        }
      })
    }
  }

  relationId(data, dataId, oldId) {
    return new Promise((resolve) => {
      let array = []
      if (data.tables.length) {
        for (let x in data.tables) {
          console.log("Relation Table", data.tables[x], data.col)
          array.push(["UPDATE " + data.tables[x] + " SET " + data.col + " = " + dataId + " WHERE " + data.col + " = ?", [oldId]])
        }

        if (data.reference.length) {
          for (let x in data.reference) {
            console.log("Reference Table", data.reference[x])
            array.push(["UPDATE " + data.reference[x] + " SET reference_id = " + dataId + " WHERE reference_id = ?", [oldId]])
          }
        }

      } else {
        if (data.reference.length) {
          for (let x in data.reference) {
            console.log("Reference Table", data.reference[x])
            array.push(["UPDATE " + data.reference[x] + " SET reference_id = " + dataId + " WHERE reference_id = ?", [oldId]])
          }
        } else {
          resolve()
        }
      }

      this.myFunctionProvider.dbQueryBatch(array).then(() => {
        resolve()
      })
    })
  }

  difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function (result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }

}
