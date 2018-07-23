import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisrCreatePage } from './disr-create';
import { MyHeaderComponentModule } from '../../components/my-header/my-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    DisrCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DisrCreatePage),
    MyHeaderComponentModule,
    NgxDatatableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DisrCreatePageModule {}
