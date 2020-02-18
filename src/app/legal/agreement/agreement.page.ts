import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AgreementModel } from 'src/app/legal/@shared/agreement.model';
import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { LegalService } from 'src/app/legal/@shared/legal.service';
import { PageTrack } from 'src/app/@shared/page-track.decorator';

@PageTrack()
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

  public initialized: boolean = false;
  public firstLoadFinished: boolean = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private legalService: LegalService,
    private modalController: ModalController,
  ) { }

  public ngOnInit(): void {
    this.type = this.type || this.activatedRoute.snapshot.params.type || 'terms';
  }

  public ionViewDidEnter(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.loadAgreements();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public consent(): void {
    this.close({ agreement: this.agreement });
  }

  public close(data: any = {}): void {
    this.modalController.dismiss(data).catch();
  }

  private loadAgreements(): void {
    if (this.agreement) { return; }

    this.legalService.getLatestAgreement(this.type)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((agreement) => {
        this.agreement = agreement;
        this.firstLoadFinished = true;
      });

  }
}
