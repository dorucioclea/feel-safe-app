import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppVersionService } from 'src/app/@core/app-version.service';
import { environment } from 'src/environments/environment';

const minKnocks = 13;

@Component({
  selector: 'app-info',
  templateUrl: './app-info.component.html',
  styleUrls: ['./app-info.component.scss'],
})
export class AppInfoComponent {
  public name: string = 'Not set';
  public id: string = 'Not set';
  public version: string = 'Not set';
  public environment: string = 'Not set';

  private knocks: number = 0;

  constructor(
    private appVersionService: AppVersionService,
    private router: Router,
  ) {
    this.getAppInfo();
  }

  public knockToOpenGodMode(): void {
    this.knocks++;

    if (this.knocks >= minKnocks) {
      this.knocks = 0;
      this.router.navigate(['/god-mode']).catch();
    }
  }

  private getAppInfo(): void {
    this.appVersionService.getAppName().then((result) => { this.name = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getPackageName().then((result) => { this.id = result; }).catch((error) => { console.error(error); });
    this.appVersionService.getAppVersion().then((result) => { this.version = result; }).catch((error) => { console.error(error); });
    this.environment = environment.name;
  }
}
