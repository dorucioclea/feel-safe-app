import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Platform } from '@ionic/angular';

import { C } from '../constants';
import { FileUploadService } from '../../@core/file-upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Input() public ratio: string;
  @Input() public imageId: string;
  @Output() public imageReceived: EventEmitter<string> = new EventEmitter<string>();

  public isLoading: boolean = false;
  public ratioPercentage: string;
  public ratioFactor: number;

  private widthRatio: number;
  private heightRatio: number;

  constructor(
    private camera: Camera,
    private crop: Crop,
    private fileUploadService: FileUploadService,
    private platform: Platform,
  ) { }

  public ngOnInit(): void {
    this.calculateImageRatio();
  }

  public getImage(source: string): void {
    if (!this.platform.is('cordova')) {
      return this.getImageWebFallback();
    }

    const options: CameraOptions = {
      sourceType: source === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: C.imageUploadOptions.quality,
      targetWidth: C.imageUploadOptions.targetWidth,
      targetHeight: C.imageUploadOptions.targetHeight,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: true,
    };

    if (this.platform.is('ios')) {
      options.allowEdit = false;
    }

    this.camera.getPicture(options).then(async (fileUri: any) => {
      if (this.platform.is('ios')) {
        // @ts-ignore ignore this, because we are using a fork of the crop plugin
        fileUri = await this.crop.crop(fileUri, { quality: options.quality, widthRatio: this.widthRatio, heightRatio: this.heightRatio, targetHeight: options.targetHeight, targetWidth: options.targetWidth });
      }

      this.isLoading = true;

      this.fileUploadService.upload(fileUri).then((res: any) => {
        const response = JSON.parse(res.response);
        const imageId = response.id;
        this.isLoading = false;
        this.imageId = imageId;

        this.imageReceived.emit(imageId);
      }).catch((error) => {
        this.isLoading = false;
        console.error(error);
      });

    }, (err) => {
      this.isLoading = false;
      console.error(err);
    });
  }

  public deleteImage(): void {
    this.fileUploadService.delete(this.imageId).then(() => {
      this.imageId = null;
      this.imageReceived.emit('deleted');
    }).catch();
  }

  private calculateImageRatio(): void {
    if (!this.ratio) {
      this.ratio = '3:2';
    }

    const HUNDRED = 100;
    const TWO = 2;
    const arr = this.ratio.split(':');
    if (arr.length !== TWO) {
      this.ratioPercentage = (HUNDRED / this.ratioFactor).toFixed(TWO) + '%';

      return;
    }

    this.widthRatio = parseInt(arr[0]);
    this.heightRatio = parseInt(arr[1]);
    this.ratioFactor = parseInt(arr[0]) / parseInt(arr[1]);
    this.ratioPercentage = (HUNDRED / this.ratioFactor).toFixed(TWO) + '%';
  }

  private getImageWebFallback(): void {
    console.log('fallback', environment.uploadWebFallbackImage, environment.name);
    if (!environment.uploadWebFallbackImage) { return; }

    this.imageReceived.emit(environment.uploadWebFallbackImage);
  }
}
