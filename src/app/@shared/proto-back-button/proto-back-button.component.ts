import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'proto-back-button',
  templateUrl: './proto-back-button.component.html',
  styleUrls: ['./proto-back-button.component.scss'],
})
export class ProtoBackButtonComponent implements OnInit {
  @Input() public defaultHref = 'home';
  @Input() public text = '';
  @Input() public icon = 'arrow-round-back';
  @Input() public color = 'dark';
  @Input() public mode = 'ios';

  constructor() { }

  public ngOnInit() {}
}
