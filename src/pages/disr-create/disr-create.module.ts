import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisrCreatePage } from './disr-create';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxQRCodeModule } from 'ngx-qrcode3';
import { PopupMenuComponentModule } from '../../components/popup-menu/popup-menu.module';
import { ChartModule } from 'angular2-chartjs';
import { FileOpener } from '@ionic-native/file-opener';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    DisrCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DisrCreatePage),
    MyHeaderComponentModule,
    NgxDatatableModule,
    NgxQRCodeModule,
    PopupMenuComponentModule,
    ChartModule
  ],
  providers: [FileOpener, SocialSharing],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisrCreatePageModule {}
