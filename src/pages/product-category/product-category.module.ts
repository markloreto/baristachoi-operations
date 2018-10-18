import { MyHeaderComponentModule } from './../../components/my-header/my-header.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductCategoryPage } from './product-category';
import { PopupMenuComponentModule } from '../../components/popup-menu/popup-menu.module';

@NgModule({
  declarations: [
    ProductCategoryPage
  ],
  imports: [
    IonicPageModule.forChild(ProductCategoryPage),
    MyHeaderComponentModule,
    PopupMenuComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCategoryPageModule {}
