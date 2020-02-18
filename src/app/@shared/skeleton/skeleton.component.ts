import { Component, OnInit, Input } from '@angular/core';

const DEFAULT_COUNT: number = 6;

@Component({
  selector: 'proto-skeleton',
  host: {
    class: 'proto-skeleton',
  },
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent implements OnInit {
  @Input() public type: string = 'default';
  @Input() public count: number = DEFAULT_COUNT;

  public items: any[] = [];

  constructor() { }

  public ngOnInit(): void {
    this.items = new Array(this.count);
  }
}
