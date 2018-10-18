import { FormioModule } from 'angular-formio';
import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryReceiptFilterPage } from './delivery-receipt-filter';

@NgModule({
  declarations: [
    DeliveryReceiptFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryReceiptFilterPage),
    MyHeaderComponentModule,
    FormioModule
  ],
})
export class DeliveryReceiptFilterPageModule {}
