import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import moment from 'moment'

/**
 * Generated class for the DeliveryReceiptFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delivery-receipt-filter',
  templateUrl: 'delivery-receipt-filter.html',
})
export class DeliveryReceiptFilterPage {
  options: any
  components: any
  staffs: any = []
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.staffs = navParams.get("staffs")
    console.log("Staffs", this.staffs)
    let staffsChecked = {}
    for(let x in this.staffs){
      staffsChecked[this.staffs[x].value] = true
    }
    this.components = [
      {
        autofocus: false,
        input: true,
        tableView: true,
        label: "Filter Type",
        key: "filterType",
        placeholder: "",
        data: {
          values: [
            {
              value: "default",
              label: "Default",
              $$hashKey: "object:7022"
            },
            {
              value: "dr",
              label: "DR #",
              $$hashKey: "object:7023"
            },
            {
              value: "numberOfKilos",
              label: "Number of Kilos",
              $$hashKey: "object:7024"
            },
            {
              value: "amount",
              label: "Amount",
              $$hashKey: "object:7025"
            }
          ],
          json: "",
          url: "",
          resource: "",
          custom: ""
        },
        dataSrc: "values",
        valueProperty: "",
        defaultValue: "default",
        refreshOn: "",
        filter: "",
        authenticate: false,
        template: "<span>{{ item.label }}</span>",
        multiple: false,
        protected: false,
        unique: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        validate: {
          required: true
        },
        type: "select",
        $$hashKey: "object:314",
        labelPosition: "top",
        tags: [
        ],
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        properties: {
        },
        lockKey: true,
        isNew: false
      },
      {
        clearOnHide: false,
        key: "undefinedPanel",
        input: false,
        title: "Date",
        theme: "default",
        tableView: false,
        components: [
          {
            autofocus: false,
            input: true,
            tableView: true,
            label: "Select",
            key: "dateType",
            placeholder: "",
            data: {
              values: [
                {
                  value: "equalTo",
                  label: "Equal to",
                  $$hashKey: "object:6262"
                },
                {
                  value: "greaterThan",
                  label: "Greater than",
                  $$hashKey: "object:6263"
                },
                {
                  value: "greaterThanOrEqualTo",
                  label: "Greater than or Equal to",
                  $$hashKey: "object:6264"
                },
                {
                  value: "lessThan",
                  label: "Less than",
                  $$hashKey: "object:6265"
                },
                {
                  value: "lessThanOrEqualTo",
                  label: "Less than or Equal to",
                  $$hashKey: "object:6266"
                }
              ],
              json: "",
              url: "",
              resource: "",
              custom: ""
            },
            dataSrc: "values",
            valueProperty: "",
            defaultValue: "equalTo",
            refreshOn: "",
            filter: "",
            authenticate: false,
            template: "<span>{{ item.label }}</span>",
            multiple: false,
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false
            },
            type: "select",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            lockKey: true,
            hideLabel: true,
            $$hashKey: "object:6234"
          },
          {
            autofocus: false,
            input: true,
            tableView: true,
            label: "Date Time",
            key: "date",
            placeholder: "",
            format: "yyyyMMdd",
            enableDate: true,
            enableTime: false,
            defaultDate: "moment()",
            datepickerMode: "day",
            datePicker: {
              showWeeks: true,
              startingDay: 0,
              initDate: "",
              minMode: "day",
              maxMode: "year",
              yearRows: 4,
              yearColumns: 5,
              minDate: null,
              maxDate: null,
              datepickerMode: "day"
            },
            timePicker: {
              hourStep: 1,
              minuteStep: 1,
              showMeridian: true,
              readonlyInput: false,
              mousewheel: true,
              arrowkeys: true
            },
            protected: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false,
              custom: ""
            },
            type: "datetime",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            hideLabel: true,
            lockKey: true,
            $$hashKey: "object:6235"
          }
        ],
        type: "panel",
        breadcrumb: "none",
        $$hashKey: "object:467",
        hideLabel: false,
        tags: [
        ],
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        properties: {
        },
        customConditional: "show = (data['filterType'] == 'numberOfKilos' || data['filterType'] == 'default' || data['filterType'] == 'amount')"
      },
      {
        autofocus: false,
        input: true,
        tableView: true,
        inputType: "number",
        label: "DR #",
        key: "dr",
        placeholder: "",
        prefix: "",
        suffix: "",
        defaultValue: "",
        protected: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        validate: {
          required: false,
          min: "",
          max: "",
          step: "any",
          integer: "",
          multiple: "",
          custom: ""
        },
        type: "number",
        $$hashKey: "object:2385",
        labelPosition: "top",
        tags: [
        ],
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        properties: {
        },
        customConditional: "show = (data['filterType'] == 'dr')"
      },
      {
        clearOnHide: false,
        key: "undefinedPanel3",
        input: false,
        title: "Number of Kilos",
        theme: "default",
        tableView: false,
        components: [
          {
            autofocus: false,
            input: true,
            tableView: true,
            label: "Select",
            key: "numberOfKilosType",
            placeholder: "",
            data: {
              values: [
                {
                  value: "equalTo",
                  label: "Equal to",
                  $$hashKey: "object:4760"
                },
                {
                  value: "greaterThan",
                  label: "Greater than",
                  $$hashKey: "object:4761"
                },
                {
                  value: "greaterThanOrEqualTo",
                  label: "Greater than or Equal to",
                  $$hashKey: "object:4762"
                },
                {
                  value: "lessThan",
                  label: "Less than",
                  $$hashKey: "object:4763"
                },
                {
                  value: "lessThanOrEqualTo",
                  label: "Less than or Equal to",
                  $$hashKey: "object:4764"
                }
              ],
              json: "",
              url: "",
              resource: "",
              custom: ""
            },
            dataSrc: "values",
            valueProperty: "",
            defaultValue: "equalTo",
            refreshOn: "",
            filter: "",
            authenticate: false,
            template: "<span>{{ item.label }}</span>",
            multiple: false,
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false
            },
            type: "select",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            lockKey: true,
            $$hashKey: "object:4748",
            hideLabel: true,
            isNew: false
          },
          {
            autofocus: false,
            input: true,
            tableView: true,
            inputType: "number",
            label: "Number of Kilos",
            key: "numberOfKilos",
            placeholder: "",
            prefix: "",
            suffix: "",
            defaultValue: "",
            protected: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false,
              min: "",
              max: "",
              step: "any",
              integer: "",
              multiple: "",
              custom: ""
            },
            type: "number",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            lockKey: true,
            $$hashKey: "object:5081",
            hideLabel: true
          }
        ],
        type: "panel",
        breadcrumb: "none",
        $$hashKey: "object:3949",
        hideLabel: false,
        tags: [
        ],
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        properties: {
        },
        customConditional: "show = (data['filterType'] == 'numberOfKilos')"
      },
      {
        clearOnHide: false,
        key: "undefinedPanel2",
        input: false,
        title: "Amount",
        theme: "default",
        tableView: false,
        components: [
          {
            autofocus: false,
            input: true,
            tableView: true,
            label: "Select",
            key: "amountType",
            placeholder: "",
            data: {
              values: [
                {
                  value: "equalTo",
                  label: "Equal to",
                  $$hashKey: "object:3385"
                },
                {
                  value: "greaterThan",
                  label: "Greater than",
                  $$hashKey: "object:3386"
                },
                {
                  value: "greaterThanOrEqualTo",
                  label: "Greater than or Equal to",
                  $$hashKey: "object:3387"
                },
                {
                  value: "lessThan",
                  label: "Less than",
                  $$hashKey: "object:3388"
                },
                {
                  value: "lessThanOrEqualTo",
                  label: "Less than or Equal to",
                  $$hashKey: "object:3389"
                }
              ],
              json: "",
              url: "",
              resource: "",
              custom: ""
            },
            dataSrc: "values",
            valueProperty: "",
            defaultValue: "equalTo",
            refreshOn: "",
            filter: "",
            authenticate: false,
            template: "<span>{{ item.label }}</span>",
            multiple: false,
            protected: false,
            unique: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false
            },
            type: "select",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            lockKey: true,
            $$hashKey: "object:3373",
            hideLabel: true
          },
          {
            autofocus: false,
            input: true,
            tableView: true,
            inputType: "number",
            label: "Number",
            key: "amount",
            placeholder: "",
            prefix: "₱",
            suffix: "",
            defaultValue: "",
            protected: false,
            persistent: true,
            hidden: false,
            clearOnHide: true,
            validate: {
              required: false,
              min: "",
              max: "",
              step: "any",
              integer: "",
              multiple: "",
              custom: ""
            },
            type: "number",
            $$hashKey: "object:3659",
            labelPosition: "top",
            tags: [
            ],
            conditional: {
              show: "",
              when: null,
              eq: ""
            },
            properties: {
            },
            hideLabel: true
          }
        ],
        type: "panel",
        breadcrumb: "none",
        $$hashKey: "object:3104",
        hideLabel: false,
        tags: [
        ],
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        properties: {
        },
        customConditional: "show = (data['filterType'] == 'amount')"
      },
      {
        autofocus: false,
        input: true,
        tableView: true,
        label: "Created By",
        key: "createdBy",
        defaultValue: staffsChecked,
        values: this.staffs,
        inline: false,
        protected: false,
        persistent: true,
        hidden: false,
        clearOnHide: true,
        validate: {
          required: false
        },
        type: "selectboxes",
        labelPosition: "top",
        optionsLabelPosition: "right",
        conditional: {
          show: "",
          when: null,
          eq: ""
        },
        lockKey: true,
        customConditional: "show = (data['filterType'] == 'numberOfKilos' || data['filterType'] == 'default' || data['filterType'] == 'amount')",
        $$hashKey: "object:7971"
      },
      {
        type: "button",
        theme: "primary",
        disableOnInvalid: true,
        action: "submit",
        block: false,
        rightIcon: "",
        leftIcon: "",
        size: "md",
        key: "submit",
        tableView: false,
        label: "Submit",
        input: true,
        $$hashKey: "object:22",
        autofocus: false
      }
    ]

    this.options = {
      "hooks": {
        "beforeSubmit": (submission, callback) => {
          console.log("before", submission);
          let data = submission.data
          let newData = {}
          var offset = new Date().getTimezoneOffset();

          if(data.filterType === "default"){
            let sStaffs = []
            for(let x in data.createdBy){
              sStaffs.push(x)
            }
            data.date = moment.utc(data.date).local().format("YYYY-MM-DD HH:mm:ss")
            console.log(data.date)
            newData = {dateType: data.dateType, date: data.date, createdBy: sStaffs}
          }

          if(data.filterType === "dr"){
            if(!data.hasOwnProperty("dr")){
              setTimeout(function() {
                // Callback with a possibly manipulated submission.
                callback({
                  message: "Please input the DR #",
                  component: null
                }, null);
                return
              }, 1000);
            }else{
              newData = {dr: data.dr}
            }
          }

          if(data.filterType === "numberOfKilos"){
            let sStaffs = []
            for(let x in data.createdBy){
              sStaffs.push(x)
            }
            data.date = moment.utc(data.date).local().format("YYYY-MM-DD HH:mm:ss")
            newData = {dateType: data.dateType, date: data.date, createdBy: sStaffs, numberOfKilosType: data.numberOfKilosType, numberOfKilos: data.numberOfKilos}
          }

          if(data.filterType === "amount"){
            let sStaffs = []
            for(let x in data.createdBy){
              sStaffs.push(x)
            }
            data.date = moment.utc(data.date).local().format("YYYY-MM-DD HH:mm:ss")
            newData = {dateType: data.dateType, date: data.date, createdBy: sStaffs, amountType: data.amountType, amount: data.amount}
          }

          setTimeout(() => {
            // Callback with a possibly manipulated submission.
            submission.newData = newData
            callback(null, submission);
          }, 1000)
        }
      }
    }
  }

  onSubmit(submission: any) {
    console.log("Submited", submission); // This will print out the full submission from Form.io API.
    this.viewCtrl.dismiss(submission.newData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryReceiptFilterPage');
  }

}
