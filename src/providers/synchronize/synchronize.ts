import { Events } from 'ionic-angular';
import { MyFunctionProvider } from './../my-function/my-function';
import { Injectable } from '@angular/core';
import { default as iziToast } from 'izitoast';
import * as _ from 'lodash';

/*
  Generated class for the SynchronizeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SynchronizeProvider {
  syncPullStep: number = 0
  syncPullTables: any = []
  pushTables: any = ["products", "delivery_receipts", "disrs", "inventories", "attachments", "endorsements", "endorsement_items", "staffs"]

  syncPushTables: any = []
  syncPushStep: number = 0
  syncPushTotalRecord: number = 0

  syncDeleteTotalRecord: number = 0
  synching: boolean = false

  continous: boolean = false
  pushAllQ: boolean = false

  lastSync: any = ""

  all: boolean = false

  withConnect: any = {
    "staffs": { alias: "Staffs", col: "", tables: [], reference: [], sync: true },
    "roles": { alias: "Roles", col: "", tables: [], reference: [], sync: false },
    "products": { alias: "Products", col: "product_id", tables: ["inventories", "endorsement_items"], reference: [], sync: true },
    "product_categories": { alias: "Product Categories", col: "", tables: [], reference: [], sync: false },
    "measurement_units": { alias: "Measurement Units", col: "", tables: [], reference: [], sync: false },
    "attachments": { alias: "Attachments", col: "", tables: [], reference: [], sync: true },
    "delivery_receipts": { alias: "Delivery Receipts", col: "", tables: [], reference: ["inventories", "attachments"], sync: true, module_id: 1 },
    "inventories": { alias: "Inventories", col: "", tables: [], reference: [], sync: true },
    "modules": { alias: "Modules", col: "", tables: [], reference: [], sync: false },
    "disrs": { alias: "Daily Inventory Sales Report", col: "", tables: [], reference: ["inventories"], module_id: 2 },
    "endorsements": { alias: "Endorsements", col: "", tables: [], reference: ["endorsement_items"], sync: true },
    "endorsement_items": { alias: "Endorsements Items", col: "", tables: [], reference: [], sync: true },
  }

  omit: any = ['created_at', 'updated_at', 'deleted_at', 'mapper_id']
  constructor(private myFunctionProvider: MyFunctionProvider, public events: Events) {
    console.log('Hello SynchronizeProvider Provider');
  }

  reset() {
    this.syncPullStep = 0
    this.syncPullTables = []
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
      let syncObj
      let syncQm

      for (let n in data) {
        //omit here

        if (_.includes(updates, parseInt(n))) {
          console.log("is now omitted", data[n])
          continue
        }

        con = 0
        obj = ""
        qm = ""
        syncQm = ""
        syncObj = ""
        values = []
        columns = _.omit(data[n], this.omit)

        for (let x in columns) {
          obj += x + ","
          qm += "?,"
          v = (columns[x] == "null") ? null : columns[x]
          values.push(v)
          if (x == "shareable" && (v != this.myFunctionProvider.settings.depot.id && v != null))
            con++
        }

        if (con) {
          continue;
        } else {

        }


        obj = obj.slice(0, -1);
        qm = qm.slice(0, -1);

        if (this.withConnect[table].sync) {
          syncObj = ", sync"
          syncQm = ", ?"
          values.push(this.myFunctionProvider.getTimestamp())
        }

        batch.push(["INSERT OR REPLACE INTO " + table + " (" + obj + syncObj + ") VALUES (" + qm + syncQm + ")", values])
      }

      this.myFunctionProvider.dbQueryBatch(batch).then(() => {
        console.log("Batch", batch)
        resolve()
      })
    })
  }

  syncPullCheckforUpdates(table, data, inc, updates = [], all, skip) {
    if (inc < data.length) {
      this.myFunctionProvider.dbQuery("SELECT * FROM update_sync WHERE table_name = ? AND reference_id = ?", [table, data[inc].id]).then((rec: any) => {
        if (rec.length) {
          let record = rec[0]
          let syncVal = record.sync
          let data_omitted = _.omit(data[inc], this.omit)
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
        this.syncPullCheckforUpdates(table, data.data, 0, [], all, skip)
      } else {
        this.syncPullStep++
        this.syncPull(this.syncPullTables, all)
      }
    }).catch((e) => {
      console.log(e)
      this.synching = false
      this.myFunctionProvider.spinner(false, "")
      this.reset()
      iziToast.error({
        title: "An Error Occurred",
        message: "Internal Server Error",
      });
    })
  }

  syncPull(tables, all = false) {

      this.synching = true
      this.syncPullTables = tables


      if (this.syncPullStep < tables.length) {
        this.myFunctionProvider.spinner(true, "Pull Synching " + this.withConnect[tables[this.syncPullStep]].alias)
        this.syncPullPost(tables[this.syncPullStep], all, 0)
      } else {
        //sync done
        console.log("Done Pull Synch")
        this.reset()

        this.myFunctionProvider.dbQuery("SELECT * FROM settings WHERE id = ?", [6]).then((set: any) => {
          if (set[0].data == "0") {
            this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [this.myFunctionProvider.getTimestamp(), 6]).then(() => {
              console.log("Updated last pull sync from intial value")
              this.myFunctionProvider.setSettings()
            })
          }
          this.myFunctionProvider.spinner(false, "")
          this.synching = false
          this.events.publish("sync_pull:done")

          if (this.continous && this.pushAllQ === false)
            this.syncPush(0)
          if (this.continous && this.pushAllQ)
            this.pushAll()
        })
      }

  }

  pushAllStart(i) {
    if (i < this.pushTables.length) {
      let p = []
      let n = 0
      this.myFunctionProvider.dbQuery("SELECT id FROM " + this.pushTables[i], []).then((data: any) => {
        for (let x in data) {
          n++
          p.push(["INSERT INTO update_sync VALUES (?, ?, ?)", [this.myFunctionProvider.getTimestamp() + n, this.pushTables[i], data[x].id]])
        }

        this.myFunctionProvider.dbQueryBatch(p).then(() => {
          this.pushAllStart(i + 1)
        })
      })
    } else {
      this.myFunctionProvider.nativeStorage.setItem('firstPush', this.myFunctionProvider.getTimestamp())
      this.syncPush(0)
    }
  }

  pushAll() {
    this.myFunctionProvider.spinner(true, "Push All Synching")

    console.log("All tables to push", this.pushTables)
    this.myFunctionProvider.dbQuery("DELETE FROM update_sync", []).then(() => {
      this.pushAllStart(0)
    })

  }

  deletePushData(id) {
    return new Promise((resolve) => {
      this.myFunctionProvider.dbQuery("DELETE FROM update_sync WHERE id = ?", [id]).then(() => {
        resolve()
      })
    })
  }

  syncPush(fx) {
    this.synching = true
    this.myFunctionProvider.dbQuery("SELECT * FROM update_sync WHERE table_name = ? LIMIT 1", [this.pushTables[fx]]).then((data: any) => {
      if (data.length) {
        console.log("Update Sync Data", data)
        this.myFunctionProvider.spinner(true, "Push Synching " + this.withConnect[data[0].table_name].alias)
        this.myFunctionProvider.dbQuery("SELECT * FROM " + data[0].table_name + " WHERE id = ?", [data[0].reference_id]).then((rec: any) => {
          if (rec.length) {
            rec[0].id = rec[0].id.toString()

            this.myFunctionProvider.APIPost("syncPush", { table: data[0].table_name, staff_id: this.myFunctionProvider.settings.logged_staff, record: rec[0] }).then((syncData: any) => {
              console.log("Sync Push Data", syncData)
              if (syncData.data) {
                console.log("Pure Record", rec[0])
                this.myFunctionProvider.dbQuery("UPDATE " + data[0].table_name + " SET id = ? WHERE id = ?", [syncData.data, parseInt(rec[0].id)]).then(() => {
                  if (typeof this.withConnect[data[0].table_name] != "undefined") {
                    console.log("With Connect", this.withConnect[data[0].table_name])
                    this.relationId(this.withConnect[data[0].table_name], syncData.data, parseInt(rec[0].id)).then(() => {
                      this.deletePushData(data[0].id).then(() => {
                        this.syncPush(fx)
                      })
                    })
                  }
                  else {
                    this.deletePushData(data[0].id).then(() => {
                      this.syncPush(fx)
                    })
                  }
                })
                //this.syncPush(all)
              } else {
                this.deletePushData(data[0].id).then(() => {
                  this.syncPush(fx)
                })
              }
            }).catch(() => {
              this.done()
              iziToast.error({
                title: "An Error Occurred",
                message: "Internal Server Error Code 301",
              });
            })
          } else {
            this.deletePushData(data[0].id).then(() => {
              this.syncPush(fx)
            })
          }
        })

      } else {
        fx++
        if (fx < this.pushTables.length)
          this.syncPush(fx)
        else {
          this.synching = false
          this.myFunctionProvider.spinner(false, "")
          //done
          console.log("Done Push Sync")
          if (this.continous)
            this.syncDelete()
        }
      }
    })
  }

  syncDelete() {
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
            //done
            console.log("Delete Sync: Retrieved Delete Records from server")
            this.done()
          })
        } else {
          //done
          console.log("Delete Sync: Done")
          this.done()
        }
      })
    })
  }

  done() {
    this.synching = false
    this.continous = false
    this.pushAllQ = false
    this.myFunctionProvider.spinner(false, "")
  }

  relationId(data, dataId, oldId) {
    return new Promise((resolve) => {
      let andWhere = ""
      let array = []
      if (data.tables.length) {
        for (let x in data.tables) {
          console.log("Relation Table", data.tables[x], data.col)
          array.push(["UPDATE " + data.tables[x] + " SET " + data.col + " = " + dataId + " WHERE " + data.col + " = ?", [oldId]])
        }

        if (data.reference.length) {
          for (let x in data.reference) {
            console.log("Reference Table", data.reference[x])
            andWhere = ""
            if (data.reference[x] == 'attachments' || data.reference[x] == 'inventories') {
              andWhere = " AND module_id = " + data.module_id
            }
            array.push(["UPDATE " + data.reference[x] + " SET reference_id = " + dataId + " WHERE reference_id = ?" + andWhere, [oldId]])
          }
        }

      } else {
        if (data.reference.length) {
          for (let x in data.reference) {
            console.log("Reference Table", data.reference[x])
            andWhere = ""
            if (data.reference[x] == 'attachments' || data.reference[x] == 'inventories') {
              andWhere = " AND module_id = " + data.module_id
            }
            array.push(["UPDATE " + data.reference[x] + " SET reference_id = " + dataId + " WHERE reference_id = ?" + andWhere, [oldId]])
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

  // Functions
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
