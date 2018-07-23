import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisrListPage } from './disr-list';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PopupMenuComponentModule } from '../../components/popup-menu/popup-menu.module';


@NgModule({
  declarations: [
    DisrListPage,
  ],
  imports: [
    IonicPageModule.forChild(DisrListPage),
    MyHeaderComponentModule,
    NgxDatatableModule,
    PopupMenuComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisrListPageModule {}
