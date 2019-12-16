import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'proto-skeleton',
  host: {
    class: 'proto-skeleton',
  },
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent implements OnInit {
  @Input() public type = 'default';
  @Input() public count = 6;

  public items = [];

  constructor() { }

  public ngOnInit() {
    this.items = new Array(this.count);
  }
}
