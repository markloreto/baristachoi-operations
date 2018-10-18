import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin';
import { BreadBreadcrumbsComponent } from './bread-breadcrumbs/bread-breadcrumbs';
import { TitleComponent } from './title/title';
import { AuthComponent } from './auth/auth';
import { CommonModule } from "@angular/common"
import { SyncComponent } from './sync/sync';


@NgModule({
	declarations: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
    SyncComponent
    ],
	imports: [CommonModule, IonicModule],
	exports: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
    SyncComponent
    ]
})
export class ComponentsModule {}
