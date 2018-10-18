import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndorsementListPage } from './endorsement-list';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PopupMenuComponentModule } from '../../components/popup-menu/popup-menu.module';

@NgModule({
  declarations: [
    EndorsementListPage,
  ],
  imports: [
    IonicPageModule.forChild(EndorsementListPage),
    MyHeaderComponentModule,
    NgxDatatableModule,
    PopupMenuComponentModule
  ],
})
export class EndorsementListPageModule {}
