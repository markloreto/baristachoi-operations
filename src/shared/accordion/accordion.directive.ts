import { Directive, OnInit } from '@angular/core';
import { AccordionLinkDirective } from './accordionlink.directive';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Directive({
  selector: '[appAccordion]',
})
export class AccordionDirective implements OnInit {

  protected navlinks: Array<AccordionLinkDirective> = [];
  private countState = 1;
  closeOtherLinks(openLink: AccordionLinkDirective): void {
      this.countState++;
      if ((openLink.group !== 'sub-toggled' || openLink.group !== 'main-toggled') && this.countState === 1) {
          if (window.innerWidth < 768 || (window.innerWidth >= 768 && window.innerWidth <= 1024)) {
              const toggled_element = <HTMLElement>document.querySelector('#mobile-collapse');
              toggled_element.click();
          }
      }
    this.navlinks.forEach((link: AccordionLinkDirective) => {
      if (link !== openLink && (link.group === 'sub-toggled' || openLink.group !== 'sub-toggled')) {
        link.open = false;
      }
    });
  }

  addLink(link: AccordionLinkDirective): void {
    this.navlinks.push(link);
  }

  removeGroup(link: AccordionLinkDirective): void {
    const index = this.navlinks.indexOf(link);
    if (index !== -1) {
      this.navlinks.splice(index, 1);
    }
  }

  getUrl() {
    
  }

  ngOnInit(): any {
    
  }

  constructor( ) {}
}
