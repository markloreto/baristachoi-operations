import { PopupMenuComponentModule } from './../../components/popup-menu/popup-menu.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SyncPage } from './sync';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { SyncComponentModule } from '../../components/sync/sync.module';

@NgModule({
  declarations: [
    SyncPage,
  ],
  imports: [
    IonicPageModule.forChild(SyncPage),
    MyHeaderComponentModule,
    SyncComponentModule,
    PopupMenuComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SyncPageModule {}
