import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisrCreatePage } from './disr-create';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxQRCodeModule } from 'ngx-qrcode3';

@NgModule({
  declarations: [
    DisrCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DisrCreatePage),
    MyHeaderComponentModule,
    NgxDatatableModule,
    NgxQRCodeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisrCreatePageModule {}
