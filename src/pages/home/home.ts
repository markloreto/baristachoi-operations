import { SynchronizeProvider } from './../../providers/synchronize/synchronize';
import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { NavController, IonicPage, Events } from 'ionic-angular';
import moment from 'moment'
import swal from 'sweetalert2';

import '../../assets/charts/amchart/amcharts.js';
import '../../assets/charts/amchart/gauge.js';
import '../../assets/charts/amchart/pie.js';
import '../../assets/charts/amchart/serial.js';
import '../../assets/charts/amchart/light.js';
import '../../assets/charts/amchart/ammap.js';
import '../../assets/charts/amchart/worldLow.js';
declare const AmCharts: any;
declare const $: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  staffs: any = []
  mahSyncEvent: () => void
  constructor(
    public navCtrl: NavController,
    public myFunctionProvider: MyFunctionProvider,
    private sync: SynchronizeProvider,
    public events: Events
  ) {

  }

  randomNumber(n) {
    return Math.floor(Math.random() * n)
  }

  stats() {
    let d: any = moment().format("YYYY,MM")
    d = d.split(",")
    let l: any = moment().subtract(1, "month").format("YYYY,MM")
    l = l.split(",")


    this.myFunctionProvider.dbQuery("SELECT s.*, ifnull((SELECT SUM(ifnull(i.sold, 0)) FROM inventories i INNER JOIN products p ON i.product_id = p.id INNER JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = s.id AND p.category = 1 AND i.module_id = 2 AND i.type = 2 AND strftime('%m', d.created_date) = ? AND strftime('%Y', d.created_date) = ?), 0) AS mySold, ifnull((SELECT SUM(ifnull(i.sold, 0)) FROM inventories i INNER JOIN products p ON i.product_id = p.id INNER JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = s.id AND p.category = 1 AND i.module_id = 2 AND i.type = 2 AND strftime('%m', d.created_date) = ? AND strftime('%Y', d.created_date) = ?), 0) AS last_sold, (SELECT d.created_date FROM inventories i INNER JOIN products p ON i.product_id = p.id INNER JOIN disrs d ON i.reference_id = d.id WHERE d.dealer_id = s.id AND p.category = 1 AND i.module_id = 2 AND i.type = 2 AND strftime('%m', d.created_date) = ? AND strftime('%Y', d.created_date) = ? ORDER BY i.id DESC LIMIT 1) AS last_updated FROM staffs s WHERE s.role_id = 3 AND mySold != 0 ORDER BY mySold DESC LIMIT 10", [d[1], d[0], l[1], l[0], d[1], d[0]]).then((s: any) => {
      console.log("staffs", s)
      for (let x in s) {
        if (s[x].last_sold === 0)
          s[x].last_sold = 720
        s[x].last_updated_formatted = moment(s[x].last_updated, "YYYY-MM-DD HH:mm:ss").fromNow()
      }
      this.staffs = s
    })
  }

  ionViewDidEnter() {
    this.stats();
    this.myFunctionProvider.dbQuery("SELECT * FROM update_sync", []).then((updates: any) => {
      console.log("Needs to sync", updates)
    })
  }

  freshInstall(){
    if (this.myFunctionProvider.firstTime) {
      //first time installation
      swal({
        title: 'Fresh Installation',
        text: "This will take time... bare with me",
        type: 'info',
        showCancelButton: false,
        customClass: 'animated tada',
        confirmButtonText: 'Yes, I will wait',
        allowOutsideClick: false
      }).then((result) => {
        console.log(result)

        this.myFunctionProvider.dbQuery("UPDATE settings SET data = ? WHERE id = ?", [null, 6]).then(() => {
          if (result) {
            this.myFunctionProvider.firstTime = false
            this.sync.reset()
            this.sync.syncPull(["products", "product_categories", "measurement_units", "attachments", "delivery_receipts", "inventories", "modules", "endorsements", "endorsement_items", "disrs"], true)
          }
        })

      }).catch(e => {

      })
    }else{
      if(this.myFunctionProvider.getSettings("last_push_sync") == null){
        this.myFunctionProvider.firstTime = true
        this.freshInstall()
      }
    }
  }

  ngOnInit() {
    this.freshInstall()
    AmCharts.makeChart('statistics-chart', {
      type: 'serial',
      marginTop: 0,
      hideCredits: true,
      marginRight: 80,
      dataProvider: [{
        year: 'Jan',
        value: 0.98
      }, {
        year: 'Feb',
        value: 1.87
      }, {
        year: 'Mar',
        value: 0.97
      }, {
        year: 'Apr',
        value: 1.64
      }, {
        year: 'May',
        value: 0.4
      }, {
        year: 'Jun',
        value: 2.9
      }, {
        year: 'Jul',
        value: 5.2
      }, {
        year: 'Aug',
        value: 0.77
      }, {
        year: 'Sap',
        value: 3.1
      }],
      valueAxes: [{
        axisAlpha: 0,
        dashLength: 6,
        gridAlpha: 0.1,
        position: 'left'
      }],
      graphs: [{
        id: 'g1',
        bullet: 'round',
        bulletSize: 9,
        lineColor: '#4680ff',
        lineThickness: 2,
        negativeLineColor: '#4680ff',
        type: 'smoothedLine',
        valueField: 'value'
      }],
      chartCursor: {
        cursorAlpha: 0,
        valueLineEnabled: false,
        valueLineBalloonEnabled: true,
        valueLineAlpha: false,
        color: '#fff',
        cursorColor: '#FC6180',
        fullWidth: true
      },
      categoryField: 'year',
      categoryAxis: {
        gridAlpha: 0,
        axisAlpha: 0,
        fillAlpha: 1,
        fillColor: '#FAFAFA',
        minorGridAlpha: 0,
        minorGridEnabled: true
      },
      'export': {
        enabled: true
      }
    });
  }

  onTaskStatusChange(event) {
    const parentNode = (event.target.parentNode.parentNode);
    parentNode.classList.toggle('done-task');
  }

  getRandomData() {
    let data = [];
    const totalPoints = 300;
    if (data.length > 0) {
      data = data.slice(1);
    }

    while (data.length < totalPoints) {
      const prev = data.length > 0 ? data[data.length - 1] : 50;
      let y = prev + Math.random() * 10 - 5;
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100;
      }
      data.push(y);
    }

    const res = [];
    for (let i = 0; i < data.length; ++i) {
      res.push([i, data[i]]);
    }
    return res;
  }

}
