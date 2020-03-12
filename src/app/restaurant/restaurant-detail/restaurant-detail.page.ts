import { ProtoQrCodePage } from './../../@shared/proto-qr-code/proto-qr-code.page';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { RESTAURANT_DUMMY_DATA, RestaurantModel } from 'src/app/restaurant/@shared/restaurant.model';
import { RestaurantService } from 'src/app/restaurant/@shared/restaurant.service';
import { ActionSheetController, PopoverController } from '@ionic/angular';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-restaurant-detail',
  templateUrl: './restaurant-detail.page.html',
  styleUrls: ['./restaurant-detail.page.scss'],
})
export class RestaurantDetailPage implements OnInit {
  public initialized: boolean = false;
  public restaurant: RestaurantModel = RESTAURANT_DUMMY_DATA[0];

  private id: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private refresherEvent: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private actionSheetController: ActionSheetController,
    private popoverController: PopoverController,
  ) { }

  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  public ionViewDidEnter(): void {
    if (this.initialized) { return; }

    this.initialized = true;

    this.loadRestaurant();
  }

  public refresh(event: any): void {
    this.refresherEvent = event;
    this.restaurantService.refreshRestaurantById(this.id);
  }

  public async presentPopover(): Promise<any> {
    const popover = await this.popoverController.create({
      component: ProtoQrCodePage,
      componentProps: { data: 'blueprint://prototype.berlin/restaurants/' + this.id },
      cssClass: 'proto-popover',
      translucent: true
    });
    return await popover.present();
  }

  public async share(): Promise<any> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Share',
      buttons: [{
        text: 'QR Code',
        icon: 'qr-code',
        handler: (): any => {
          this.presentPopover();
        }
      }]
    });
    await actionSheet.present();
  }

  private loadRestaurant(): void {
    this.restaurantService.getRestaurantById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((restaurant) => {
        this.restaurant = restaurant;

        this.completeRefresher();
      });
  }

  private completeRefresher(): void {
    if (this.refresherEvent) {
      this.refresherEvent.target.complete();
      this.refresherEvent = null;
    }
  }
}
