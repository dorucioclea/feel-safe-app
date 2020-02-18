import { Directive, Renderer2, ElementRef } from '@angular/core';
import { DomController, IonContent, Platform } from '@ionic/angular';

interface ParallaxItem {
  element: HTMLElement;
  isMain?: boolean;
  value: number;
  depth: number;
  scale: number;
}

@Directive({
  selector: '[proto-parallax]',

})
export class ProtoParallaxDirective {
  private parallaxContainer: HTMLElement;
  private parallaxItems: ParallaxItem[];
  private mainParallaxItem: ParallaxItem;

  private mainElementHeight: number = 0;
  private scaleAmt: number = 1;
  private initialized: boolean = false;

  constructor(
    private content: IonContent,
    private domController: DomController,
    private element: ElementRef,
    private platform: Platform,
    private renderer: Renderer2) {
  }

  public ngAfterViewInit(): void {
    const parallaxSupported = document.body.classList.contains('webkit');
    if (!parallaxSupported) { return; }

    this.parallaxContainer = this.element.nativeElement.querySelector('.proto-parallax-container');
    if (!this.parallaxContainer) { return; }

    const parallaxNodes: NodeList = this.parallaxContainer.querySelectorAll('.proto-parallax-element');
    if (!parallaxNodes.length) { return; }

    this.initParallaxItems(parallaxNodes);

    // scroll listener currently only necessary for ios
    if (!this.platform.is('ios')) { return; }

    this.content.getScrollElement().then((container: HTMLElement) => {
      this.bindScrollListener(container);
    }).catch();

  }

  public ngAfterViewChecked(): void {
    if (!this.parallaxContainer || !this.parallaxItems.length) { return; }
    this.mainElementHeight = this.parallaxItems[0].element.offsetHeight;

    if (this.initialized || !this.mainElementHeight) { return; }

    this.initialized = true;
    this.setMainParallaxItem();
  }

  private bindScrollListener(container: HTMLElement): void {
    // native scroll event seems faster on iOS than ionScroll
    container.addEventListener('scroll', (ev: any) => {
      if (!ev || !ev.target) { return; }

      const scrollValue = ev.target.scrollTop;

      if (scrollValue > 0 && this.scaleAmt === 1) {
        return;
      }

      this.updateMainParallaxItem(scrollValue);
    });
  }

  // TODO: make this work for multiple elements
  private initParallaxItems(nodelist: NodeList): void {
    this.parallaxItems = Array.from(nodelist).map((node: HTMLElement) => {
      const item: ParallaxItem = this.getParallaxItem(node);
      this.renderer.setStyle(
        item.element,
        'transform', `translateZ(${item.depth}px) scale(${item.scale})`,
      );

      return item;
    });
  }

  // main parallax item is necessary for fixed perspective origin and ios bouncing
  // TODO: discuss how we define our main parallax item
  private setMainParallaxItem(): void {
    this.mainParallaxItem = this.parallaxItems.filter((item: ParallaxItem) => item.isMain)[0];
    if (!this.mainParallaxItem) { return; }

    // TODO: we still have to set translateY value for parallax elements if perspective-origin is "bottom right"
    // (see https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/parallax/scripts/parallax.js)
    // we need to set y-value for perspective if related content has dynamic height (e.g. infinite scrolling, etc.)
    this.renderer.setStyle(this.parallaxContainer, 'perspectiveOrigin', `100% ${this.mainElementHeight}px`);
  }

  private getParallaxItem(node: HTMLElement): ParallaxItem {
    // detault value ("perspective: 1px;" in related css)
    const perspective = 1.0;

    // rate <= 0 or rate == perspective : no parallax
    // 0 < rate < perspective : moves slower than scroll container
    // perspective < rate : moves faster than scroll container
    const rate = parseFloat(node.getAttribute('parallax')) || perspective;

    return {
      element: node,
      isMain: node.classList.contains('proto-parallax-element--main'),
      get value(): number { return rate > 0 ? rate : perspective; },
      get depth(): number { return 1 - (1 / this.value); },
      get scale(): number {
        return (perspective - this.depth) / perspective;
      },
    };
  }

  private updateMainParallaxItem(scrollValue: number): void {
    this.scaleAmt = Math.max((-scrollValue / this.mainElementHeight + 1), 1);
    this.renderer.setStyle(this.mainParallaxItem.element.firstElementChild, 'transform', 'translateZ(0) scale(' + this.scaleAmt + ')');
  }
}
