import { Directive, Renderer2, ElementRef } from '@angular/core';

interface ParallaxItem {
  element: HTMLElement,
  isMain?: boolean,
  value: number,
  depth: number,
  scale: number,
}

@Directive({
  selector: '[proto-parallax]',
})
export class ProtoParallaxDirective {
  private parallaxContainer: HTMLElement;
  private parallaxItems: ParallaxItem[];

  private lastHeight = 0;
  private initialized = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2) {
  }

  public ngAfterViewInit() {
    const parallaxSupported = document.body.classList.contains('webkit');
    if (!parallaxSupported) { return; }

    this.parallaxContainer = this.element.nativeElement.querySelector('.proto-parallax-container');
    if (!this.parallaxContainer) { return; }

    const parallaxNodes: NodeList = this.parallaxContainer.querySelectorAll('.proto-parallax-element');
    if (!parallaxNodes.length) { return; }

    this.initParallaxItems(parallaxNodes);
  }

  // this lifecycle fires multiple times
  // TODO: find a better way to ensure correct dimensions
  public ngAfterViewChecked() {
    if (!this.parallaxContainer || !this.parallaxItems.length) { return; }
    this.lastHeight = this.parallaxItems[0].element.offsetHeight;

    if (this.initialized || !this.lastHeight) {
      return;
    }

    this.initialized = true;
    this.setMainParallaxItem();
  }

  // TODO: make this work for multiple elements
  private initParallaxItems(nodelist: NodeList) {
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
  private setMainParallaxItem() {
    // TODO: discuss how we define our main parallax item
    const mainParallaxItem: ParallaxItem = this.parallaxItems.filter((item: ParallaxItem) => item.isMain)[0];
    if (!mainParallaxItem) { return; }

    const mainHeight = mainParallaxItem.element.clientHeight;
    this.setPerspectiveOrigin(mainHeight);
  }

  // TODO: we still have to set translateY value for parallax elements if perspective-origin is "bottom right"
  // (see https://github.com/GoogleChromeLabs/ui-element-samples/blob/gh-pages/parallax/scripts/parallax.js)
  private setPerspectiveOrigin(height: number) {
    // we need to set y-value for perspective if related content has dynamic height (e.g. infinite scrolling, etc.)
    if (!height) { return; }
    console.log('RENDER');
    this.renderer.setStyle(this.parallaxContainer, 'perspectiveOrigin', `100% ${height}px`);
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
      get value() { return rate > 0 ? rate : perspective; },
      get depth() { return 1 - (1 / this.value); },
      get scale() {
        return (perspective - this.depth) / perspective;
      },
    };
  }
}
