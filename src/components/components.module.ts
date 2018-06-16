import { AccordionLinkDirective } from './../shared/accordion/accordionlink.directive';
import { AccordionDirective } from './../shared/accordion/accordion.directive';
import { AccordionAnchorDirective } from './../shared/accordion/accordionanchor.directive';
import { SpinnerComponent } from './../shared/spinner/spinner.component';
import { CardComponent } from './../shared/card/card.component';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin';
import { BreadBreadcrumbsComponent } from './bread-breadcrumbs/bread-breadcrumbs';
import { TitleComponent } from './title/title';
import { AuthComponent } from './auth/auth';
import { CommonModule } from "@angular/common"
import { DashboardDefaultComponent } from './dashboard-default/dashboard-default';

import { MySideMenuComponent } from './my-side-menu/my-side-menu';


@NgModule({
	declarations: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent
    ],
	imports: [CommonModule, IonicModule],
	exports: [AdminComponent,
    BreadBreadcrumbsComponent,
    TitleComponent,
    AuthComponent
    ]
})
export class ComponentsModule {}
