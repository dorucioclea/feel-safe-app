import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2 } from '@angular/core';

import {
  ProtoImageConfig as Config,
  ProtoImageType as imageType,
} from './proto-image.config';
import { URL } from 'src/app/@shared/url';

@Component({
  selector: 'proto-image',
  host: {
    class: 'proto-image',
  },
  templateUrl: './proto-image.component.html',
  styleUrls: ['./proto-image.component.scss'],
})
// tslint:disable:no-magic-numbers
export class ProtoImageComponent implements OnInit {
  @ViewChild('imageSrc', { static: true }) public imageSrc: ElementRef;
  @Input() public showFallbackImage: boolean = false;
  @Input() public imageType: imageType = 'default';

  @Input() set imageId(id: string) {
    // prevent setting fallback image
    if (!id && !this.showFallbackImage) {
      this.hasLoaded = false;

      return;
    }

    this.setImageSource(id);
  }

  public largeImage: string;
  public isFallbackImage: boolean = false;
  public hasLoaded: boolean = false;

  constructor(
    private renderer: Renderer2,
  ) { }

  public ngOnInit(): void { }

  public onImageLoaded(): void {
    this.renderer.removeAttribute(this.imageSrc.nativeElement, 'data-src');

    // probably not necessary, needs more testing
    //requestAnimationFrame(() => {
    this.hasLoaded = true;
    //});
  }

  private setImageSource(imageId: string): void {
    const TWO: number = 2;
    const ratio: number = Config.ratio[this.imageType] || Config.ratio.default;
    const width: number = TWO * (Config.width[this.imageType] || Config.width.default);

    this.largeImage = this.getImage(imageId, width, Math.ceil(width / ratio));

    this.renderer.setAttribute(this.imageSrc.nativeElement, 'src', this.largeImage);
    this.onImageLoaded();
  }

  private getImage(id: string, width?: number, height?: number): string {
    this.isFallbackImage = false;

    // default fallback image
    if (!id) { return this.getFallbackImage('fallback_default'); }

    // external image
    if (id.includes('http://')) { return id; }

    // specific fallback image, defined in related model (e.g. 'fallback_user')
    if (id.includes('fallback')) { return this.getFallbackImage(id, width); }

    // original size
    if (!width) { return URL.filesDownload(id); }

    // squared image
    if (!height) { return URL.filesDownload(id, { queryParams: { square: width } }); }

    return URL.filesDownload(id, { queryParams: { width, height } });
  }

  private getFallbackImage(name: string, width?: number): string {
    this.isFallbackImage = true;

    let key: string = name.substring(name.indexOf('_') + 1);

    if (!key || !Config.fallback[key]) {
      key = 'default';
    }

    // for smaller images like thumbnails use small fallback image if available
    if (width && width < Config.width.default) {
      return Config.fallback[key + '-small'] || Config.fallback[key];
    }

    return Config.fallback[key];
  }
}
