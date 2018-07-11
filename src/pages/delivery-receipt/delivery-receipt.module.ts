import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryReceiptPage } from './delivery-receipt';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    DeliveryReceiptPage
  ],
  imports: [
    IonicPageModule.forChild(DeliveryReceiptPage),
    MyHeaderComponentModule,
    NgxDatatableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ScreenOrientation]
})
export class DeliveryReceiptPageModule {}
