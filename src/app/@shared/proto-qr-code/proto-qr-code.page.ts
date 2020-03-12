import { Component, OnInit } from '@angular/core';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { NavParams } from '@ionic/angular';

const DEFAULT_TYPE = 'url';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-proto-qr-code',
  templateUrl: './proto-qr-code.page.html',
  styleUrls: ['./proto-qr-code.page.scss'],
})
export class ProtoQrCodePage implements OnInit {
  public data: string;
  public type: string = DEFAULT_TYPE;
  constructor(
    private navParams: NavParams,
  ) { }

  public ngOnInit(): void {
    this.data = this.navParams.get('data');
  }
}
