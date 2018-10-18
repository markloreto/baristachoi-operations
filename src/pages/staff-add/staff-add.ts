import { MyFunctionProvider } from './../../providers/my-function/my-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment'

/**
 * Generated class for the StaffAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staff-add',
  templateUrl: 'staff-add.html',
})
export class StaffAddPage {
  options: any
  components: any
  modify: boolean
  user: any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunctionProvider: MyFunctionProvider
  ) {
    this.modify = navParams.get("modify")
    this.user = navParams.get("user")
    console.log("User", this.user)
    this.components = [{
      clearOnHide: false,
      key: "undefinedFieldset",
      input: false,
      tableView: false,
      legend: "General",
      components: [
        {
          autofocus: false,
          input: true,
          tableView: true,
          inputType: "text",
          inputMask: "",
          label: "Name",
          key: "undefinedName",
          placeholder: "Juan dela Cruz",
          prefix: "",
          suffix: "",
          multiple: false,
          defaultValue: (this.modify) ? this.user.name : "",
          protected: false,
          unique: false,
          persistent: false,
          hidden: false,
          clearOnHide: true,
          spellcheck: true,
          validate: {
            required: true,
            minLength: "",
            maxLength: "",
            pattern: "",
            custom: "",
            customPrivate: false
          },
          conditional: {
            show: "",
            when: null,
            eq: ""
          },
          type: "textfield",
          labelPosition: "top",
          inputFormat: "plain",
          tags: [
          ],
          properties: {
          },
          $$hashKey: "object:1254"
        },
        {
          autofocus: false,
          input: true,
          tableView: true,
          inputType: "text",
          inputMask: "",
          label: "Address",
          key: "undefinedAddress",
          placeholder: "",
          prefix: "",
          suffix: "",
          multiple: false,
          defaultValue: (this.modify) ? this.user.address : "",
          protected: false,
          unique: false,
          persistent: false,
          hidden: false,
          clearOnHide: true,
          spellcheck: true,
          validate: {
            required: true,
            minLength: "",
            maxLength: "",
            pattern: "",
            custom: "",
            customPrivate: false
          },
          conditional: {
            show: "",
            when: null,
            eq: ""
          },
          type: "textfield",
          labelPosition: "top",
          inputFormat: "plain",
          tags: [
          ],
          properties: {
          },
          $$hashKey: "object:1296"
        },
        {
          autofocus: false,
          input: true,
          tableView: true,
          label: "Birthday",
          key: "undefinedFieldsetBirthday",
          placeholder: "",
          format: "yyyyMMdd",
          enableDate: true,
          enableTime: false,
          defaultDate: (this.modify) ? moment(this.user.birthday) : "",
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
          persistent: false,
          hidden: false,
          clearOnHide: true,
          validate: {
            required: true,
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
          $$hashKey: "object:4629"
        },
        {
          autofocus: false,
          input: true,
          tableView: true,
          inputType: "tel",
          inputMask: "(9999) 9999999",
          label: "Phone Number",
          key: "undefinedPhoneNumber2",
          placeholder: "",
          prefix: "",
          suffix: "",
          multiple: false,
          protected: false,
          unique: false,
          persistent: true,
          hidden: false,
          defaultValue: (this.modify) ? this.user.contact : "(9999) 9999999",
          clearOnHide: true,
          validate: {
            required: true
          },
          type: "phoneNumber",
          labelPosition: "top",
          inputFormat: "plain",
          tags: [
          ],
          conditional: {
            show: "",
            when: null,
            eq: ""
          },
          properties: {
          },
          $$hashKey: "object:4731"
        },
        {
          autofocus: false,
          input: true,
          tableView: true,
          label: "Photo",
          key: "photos",
          image: true,
          imageSize: "200",
          placeholder: "",
          multiple: false,
          defaultValue: "",
          protected: false,
          persistent: false,
          hidden: false,
          clearOnHide: true,
          filePattern: "*",
          fileMinSize: "0KB",
          fileMaxSize: "1GB",
          type: "file",
          $$hashKey: "object:3994",
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
          storage: "base64",
          validate: {
            required: (this.modify) ? false : true
          }
        },
        {
          autofocus: false,
          input: true,
          tableView: true,
          label: "Select",
          key: "undefinedSelect",
          placeholder: "",
          data: {
            values: [
              {
                value: "single",
                label: "Single",
                $$hashKey: "object:841"
              },
              {
                value: "married",
                label: "Married",
                $$hashKey: "object:846"
              },
              {
                value: "widowed",
                label: "Widowed",
                $$hashKey: "object:851"
              },
              {
                value: "divorced",
                label: "Divorced",
                $$hashKey: "object:856"
              }
            ],
            json: "",
            url: "",
            resource: "",
            custom: ""
          },
          dataSrc: "values",
          valueProperty: "",
          defaultValue: (this.modify) ? this.user.marital_status : "married",
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
          $$hashKey: "object:695",
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
          isNew: false
        },
        {
          input: true,
          tableView: true,
          inputType: "text",
          inputMask: "",
          label: "Facebook Username",
          key: "fb",
          placeholder: "Enter your first name",
          prefix: "facebook.com/",
          suffix: "",
          multiple: false,
          defaultValue: (this.modify) ? this.user.fb : "",
          protected: false,
          unique: false,
          persistent: true,
          validate: {
            required: false,
            minLength: "",
            maxLength: "",
            pattern: "",
            custom: "",
            customPrivate: false
          },
          conditional: {
            show: "",
            when: null,
            eq: ""
          },
          type: "textfield",
          $$hashKey: "object:18",
          autofocus: false,
          hidden: false,
          clearOnHide: true,
          spellcheck: false,
          labelPosition: "top",
          inputFormat: "plain",
          tags: [
          ],
          properties: {
          },
          description: "Your public username is the same as your timeline address:"
        }
      ],
      type: "fieldset",
      $$hashKey: "object:1130",
      hideLabel: true,
      tags: [
      ],
      conditional: {
        show: "",
        when: null,
        eq: ""
      },
      properties: {
      }
    },
    {
      clearOnHide: false,
      key: "undefinedFieldset2",
      input: false,
      tableView: false,
      legend: "Benefits",
      components: [
        {
          clearOnHide: false,
          label: "Columns",
          input: false,
          tableView: false,
          key: "undefinedFieldset2Columns",
          columns: [
            {
              components: [
                {
                  autofocus: false,
                  input: true,
                  tableView: true,
                  inputType: "text",
                  inputMask: "",
                  label: "SSS",
                  key: "undefinedFieldset2ColumnsSss",
                  placeholder: "",
                  prefix: "",
                  suffix: "",
                  multiple: false,
                  defaultValue: (this.modify) ? this.user.sss : "",
                  protected: false,
                  unique: false,
                  persistent: true,
                  hidden: false,
                  clearOnHide: true,
                  spellcheck: true,
                  validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                  },
                  conditional: {
                    show: "",
                    when: null,
                    eq: ""
                  },
                  type: "textfield",
                  labelPosition: "top",
                  inputFormat: "plain",
                  tags: [
                  ],
                  properties: {
                  },
                  $$hashKey: "object:2451"
                },
                {
                  autofocus: false,
                  input: true,
                  tableView: true,
                  inputType: "text",
                  inputMask: "",
                  label: "Pagibig",
                  key: "undefinedFieldset2ColumnsPagIbig",
                  placeholder: "",
                  prefix: "",
                  suffix: "",
                  multiple: false,
                  defaultValue: (this.modify) ? this.user.pagibig : "",
                  protected: false,
                  unique: false,
                  persistent: true,
                  hidden: false,
                  clearOnHide: true,
                  spellcheck: true,
                  validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                  },
                  conditional: {
                    show: "",
                    when: null,
                    eq: ""
                  },
                  type: "textfield",
                  $$hashKey: "object:2484",
                  labelPosition: "top",
                  inputFormat: "plain",
                  tags: [
                  ],
                  properties: {
                  }
                }
              ],
              width: 6,
              offset: 0,
              push: 0,
              pull: 0,
              $$hashKey: "object:2445"
            },
            {
              components: [
                {
                  autofocus: false,
                  input: true,
                  tableView: true,
                  inputType: "text",
                  inputMask: "",
                  label: "Philhealth",
                  key: "undefinedFieldset2ColumnsPhilhealth",
                  placeholder: "",
                  prefix: "",
                  suffix: "",
                  multiple: false,
                  defaultValue: (this.modify) ? this.user.philhealth : "",
                  protected: false,
                  unique: false,
                  persistent: true,
                  hidden: false,
                  clearOnHide: true,
                  spellcheck: true,
                  validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                  },
                  conditional: {
                    show: "",
                    when: null,
                    eq: ""
                  },
                  type: "textfield",
                  labelPosition: "top",
                  inputFormat: "plain",
                  tags: [
                  ],
                  properties: {
                  },
                  $$hashKey: "object:2460"
                }
              ],
              width: 6,
              offset: 0,
              push: 0,
              pull: 0,
              $$hashKey: "object:2446"
            }
          ],
          type: "columns",
          $$hashKey: "object:1703",
          hideLabel: true,
          tags: [
          ],
          conditional: {
            show: "",
            when: null,
            eq: ""
          },
          properties: {
          },
          isNew: false
        }
      ],
      type: "fieldset",
      $$hashKey: "object:1385",
      hideLabel: true,
      tags: [
      ],
      conditional: {
        show: "",
        when: null,
        eq: ""
      },
      properties: {
      }
    },
    {
      type: "button",
      theme: "primary",
      disableOnInvalid: true,
      action: "submit",
      block: true,
      rightIcon: "",
      leftIcon: "",
      size: "md",
      key: "submit",
      tableView: false,
      label: "Submit",
      input: true,
      $$hashKey: "object:22",
      autofocus: false
    }]


    this.options = {
      "hooks": {
        "beforeSubmit": (submission, callback) => {
          console.log("before", submission);
          this.myFunctionProvider.spinner(true, "Submitting")

          if(submission.data.undefinedFieldsetBirthday.search(" ") != -1){
            submission.data.undefinedFieldsetBirthday = submission.data.undefinedFieldsetBirthday.slice(0, submission.data.undefinedFieldsetBirthday.indexOf(" "))
            submission.data.undefinedFieldsetBirthday = submission.data.undefinedFieldsetBirthday + " 00:00:00"
          }
          else{
            submission.data.undefinedFieldsetBirthday = submission.data.undefinedFieldsetBirthday.slice(0, submission.data.undefinedFieldsetBirthday.indexOf("T"))
            submission.data.undefinedFieldsetBirthday = submission.data.undefinedFieldsetBirthday + " 00:00:00"
          }

          if(submission.data.photos.length){
            this.myFunctionProvider.savebase64AsImageFile("upload.jpg", submission.data.photos[0].data, "image/jpeg").then((f: any) => {
              this.myFunctionProvider.imageProcess(f.nativeURL).then((i: any) => {
                console.log(i)
                submission.data["photo"] = i
                setTimeout(() => {
                  // Callback with a possibly manipulated submission.


                  callback(null, submission);
                }, 1000)
              })
            })
          }else{
            submission.data["photo"] = {photo: this.user.photo, thumbnail: this.user.thumbnail}
            setTimeout(() => {
              // Callback with a possibly manipulated submission.


              callback(null, submission);
            }, 1000)
          }

        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffAddPage');
  }

  onSubmit(submission: any) {
    console.log("Submited", submission); // This will print out the full submission from Form.io API.
    if(this.modify){
      this.myFunctionProvider.dbQuery("UPDATE staffs SET name = ?, photo = ?, thumbnail = ?, role_id = ?, contact = ?, address = ?, sss = ?, philhealth = ?, pagibig = ?, birthday = ?, fb = ?, marital_status = ? WHERE id = ?", [submission.data.undefinedName, submission.data.photo.photo, submission.data.photo.thumbnail, 3, submission.data.undefinedPhoneNumber2, submission.data.undefinedAddress, submission.data.undefinedFieldset2ColumnsSss, submission.data.undefinedFieldset2ColumnsPhilhealth, submission.data.undefinedFieldset2ColumnsPagIbig, submission.data.undefinedFieldsetBirthday, submission.data.fb, submission.data.undefinedSelect, this.user.id]).then(() => {
        this.myFunctionProvider.spinner(false, "")
        this.navCtrl.pop()
        this.myFunctionProvider.scanUpdates(["staffs"])
      })
    }else{
      this.myFunctionProvider.dbQuery("INSERT INTO staffs (id, depot_id, name, photo, thumbnail, role_id, contact, address, sss, philhealth, pagibig, birthday, fb, marital_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [this.myFunctionProvider.getTimestamp(), this.myFunctionProvider.settings.depot.id, submission.data.undefinedName, submission.data.photo.photo, submission.data.photo.thumbnail, 3, submission.data.undefinedPhoneNumber2, submission.data.undefinedAddress, submission.data.undefinedFieldset2ColumnsSss, submission.data.undefinedFieldset2ColumnsPhilhealth, submission.data.undefinedFieldset2ColumnsPagIbig, submission.data.undefinedFieldsetBirthday, submission.data.fb, submission.data.undefinedSelect]).then(() => {
        this.myFunctionProvider.spinner(false, "")
        this.navCtrl.pop()
        this.myFunctionProvider.scanUpdates(["staffs"])
      })
    }

  }

}
