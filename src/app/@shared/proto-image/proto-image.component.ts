import { Component, OnInit, ViewChild, Input, ElementRef, Renderer2, SimpleChanges } from '@angular/core';

import { C } from '../constants';
import {
  ProtoImageConfig as Config,
  ProtoImageType as imageType,
} from './proto-image.config';

@Component({
  selector: 'app-proto-image',
  host: {
    class: 'proto-image',
  },
  templateUrl: './proto-image.component.html',
  styleUrls: ['./proto-image.component.scss'],
})
// tslint:disable:no-magic-numbers
export class ProtoImageComponent implements OnInit {
  @ViewChild('imageSrc') public imageSrc: ElementRef;
  @Input() public imageId: string;
  @Input() public imageType: imageType = 'default';

  public largeImage: string;
  public placeholderImage: string;
  public isFallbackImage = false;

  // image callbacks for binding event listeners
  private listeners: any = {
    load: null,
    error: null,
  };

  constructor(
    private renderer: Renderer2,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.imageId && changes.imageId.currentValue) {
      this.imageSrc.nativeElement && this.setImageSource(changes.imageId.currentValue);
    }

    if (changes.imageId && changes.imageId.previousValue && !changes.imageId.currentValue) {
      this.renderer.removeAttribute(this.imageSrc.nativeElement, 'src');
      this.largeImage = '';
      this.placeholderImage = '';
    }
  }

  public ngOnInit() { }

  public ngOnDestroy() {
    this.unbindListeners();
  }

  private setImageSource(imageId: string) {
    const ratio: number = Config.ratio[this.imageType] || Config.ratio.default;
    const width: number = 2 * (Config.width[this.imageType] || Config.width.default);

    this.largeImage = this.getImage(imageId, width, Math.ceil(width / ratio));

    // we don't need a placeholder/preload image for fallback images
    this.placeholderImage = this.isFallbackImage ? '' : this.getImage(imageId, Config.width.placeholder, Math.ceil(Config.width.placeholder / ratio));
    this.renderer.setAttribute(this.imageSrc.nativeElement, 'src', this.largeImage);

    // if image is already cached don't animate
    if (this.imageSrc.nativeElement.complete) {
      return this.onImageComplete();
    }

    this.bindListeners();
  }

  private bindListeners() {
    this.listeners.load = this.renderer.listen(this.imageSrc.nativeElement, 'load', this.onImageLoaded.bind(this));

    // unbind to prevent infinite loop
    if (this.listeners.error) { return this.listeners.error(); }
    this.listeners.error = this.renderer.listen(this.imageSrc.nativeElement, 'error', this.onImageError.bind(this));
  }

  private unbindListeners() {
    this.listeners.load && this.listeners.load();
    this.listeners.error && this.listeners.error();
  }

  // if image is already cached don't animate image
  private onImageComplete() {
    this.renderer.setStyle(this.imageSrc.nativeElement, 'transition', 'none');
    requestAnimationFrame(() => {
      this.renderer.removeAttribute(this.imageSrc.nativeElement, 'data-src');
      this.renderer.removeStyle(this.imageSrc.nativeElement, 'transition');
    });
    this.unbindListeners();
  }

  private onImageLoaded() {
    this.renderer.removeAttribute(this.imageSrc.nativeElement, 'data-src');
  }

  private onImageError() {
    this.setImageSource('fallback_error');
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
    if (!width) { return `${C.urls.files}/${id}/download`; }

    // squared image
    if (!height) { return `${C.urls.files}/${id}/download?square=${width}`; }

    return `${C.urls.files}/${id}/download?width=${width}&height=${height}`;
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
