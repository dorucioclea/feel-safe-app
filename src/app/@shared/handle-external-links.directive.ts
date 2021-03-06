import { Directive, ElementRef } from '@angular/core';
import { InAppBrowserService } from 'src/app/@core/in-app-browser.service';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[handle-external-links]',
})
export class HandleExternalLinksDirective {
  constructor(
    private element: ElementRef,
    private inAppBrowserService: InAppBrowserService,
    private platform: Platform,
  ) { }

  public ngOnInit(): void {
    this.element.nativeElement.addEventListener('click', this.onElementClicked.bind(this));
  }

  private onElementClicked(ev: any): any {
    ev.preventDefault();
    ev.stopPropagation();

    const elem = ev.srcElement;
    if (!elem) { return; }
    if (elem.tagName.toUpperCase() !== 'A') { return; }

    const url = elem.getAttribute('href');
    if (!url) { return; }

    if (url.indexOf('tel:') >= 0 || url.indexOf('mailto:') >= 0) {
      if (this.platform.is('android')) {
        return window.open(url, '_system');
      }
      window.location.href = url;

      return;
    }

    this.inAppBrowserService.openUrl(url);
  }
}
