import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AgreementModel } from 'src/app/legal/shared/agreement.model';
import { LegalService } from 'src/app/legal/shared/legal.service';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';

@HideSplash()
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.page.html',
  styleUrls: ['./agreement.page.scss'],
})
export class AgreementPage implements OnInit {
  @Input() public needsConsent: boolean;
  @Input() public type: string;
  @Input() public agreement: AgreementModel;

  public initialized = false;
  public firstLoadFinished = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private legalService: LegalService,
    private modalController: ModalController,
  ) { }

  public ngOnInit() {
    this.type = this.type || this.activatedRoute.snapshot.params.type || 'terms';
  }

  public ionViewDidEnter() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.loadAgreements();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public consent() {
    this.close({ agreement: this.agreement });
  }

  public close(data = {}) {
    this.modalController.dismiss(data).catch();
  }

  private loadAgreements() {
    if (this.agreement) { return; }

    this.legalService.getLatestAgreement(this.type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((agreement) => {
        this.agreement = agreement;
        this.firstLoadFinished = true;
      });

  }
}
