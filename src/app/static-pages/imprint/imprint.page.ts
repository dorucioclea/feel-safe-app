import { Component, OnInit } from '@angular/core';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-imprint',
  templateUrl: './imprint.page.html',
  styleUrls: ['./imprint.page.scss'],
})
export class ImprintPage implements OnInit {
  constructor() { }

  public ngOnInit(): void { }
}
