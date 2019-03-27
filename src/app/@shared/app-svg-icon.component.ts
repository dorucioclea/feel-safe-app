
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  host: {
    class: 'svg-icon',
  },
  template: '<svg><use attr.xlink:href="./assets/icons/symbol-defs.svg#icon-{{name}}" /></svg>',
})
export class AppSvgIcon {
  @Input() public name: string;
}
