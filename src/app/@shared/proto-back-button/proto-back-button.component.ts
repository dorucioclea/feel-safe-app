import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'proto-back-button',
  templateUrl: './proto-back-button.component.html',
  styleUrls: ['./proto-back-button.component.scss'],
})
export class ProtoBackButtonComponent implements OnInit {
  @Input() public text = '';
  @Input() public color = 'dark';

  constructor() { }

  public ngOnInit() {}
}
