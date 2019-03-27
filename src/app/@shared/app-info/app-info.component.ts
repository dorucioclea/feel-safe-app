import { Component, OnInit } from '@angular/core';

import { AppVersionService } from '../../@core/app-version.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss'],
})
export class AppInfoComponent {
  public name = 'Not set';
  public id = 'Not set';
  public version = 'Not set';
  public environment = 'Not set';

  constructor(
    private appVersionService: AppVersionService,
  ) {
    this.getAppInfo();
  }

  private getAppInfo() {
    this.appVersionService.getAppName().then((result) => { this.name = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getPackageName().then((result) => { this.id = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getAppVersion().then((result) => { this.version = result; }).catch((error) => { console.error(error); });
    this.environment = environment.name;
  }
}
