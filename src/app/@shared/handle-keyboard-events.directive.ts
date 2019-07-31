import { Directive } from '@angular/core';
import { Events, Platform } from '@ionic/angular';

const DEFAULT_KEYBOARD_HEIGHT = 290;

@Directive({
  selector: '[handle-keyboard-events]',
})
export class HandleKeyboardEventsDirective {
  private keyboardWillShow: EventListener;
  private keyboardDidShow: EventListener;
  private keyboardWillHide: EventListener;
  private keyboardDidHide: EventListener;

  constructor(
    private events: Events,
    private platform: Platform,
  ) { }

  public ngOnInit() {
    this.platform.ready().then(() => {
      this.keyboardWillShow = this.onKeyboardWillShow.bind(this);
      this.keyboardDidShow = this.onKeyboardDidShow.bind(this);
      this.keyboardWillHide = this.onKeyboardWillHide.bind(this);
      this.keyboardDidHide = this.onKeyboardDidHide.bind(this);
      window.addEventListener('keyboardWillShow', this.keyboardWillShow);
      window.addEventListener('keyboardDidShow', this.keyboardDidShow);
      window.addEventListener('keyboardWillHide', this.keyboardWillHide);
      window.addEventListener('keyboardDidHide', this.keyboardDidHide);

    }).catch();
  }

  public ngOnDestroy() {
    window.removeEventListener('keyboardWillShow', this.keyboardWillShow);
    window.removeEventListener('keyboardDidShow', this.keyboardDidShow);
    window.removeEventListener('keyboardWillHide', this.keyboardWillHide);
    window.removeEventListener('keyboardDidHide', this.keyboardDidHide);
  }

  private onKeyboardWillShow(ev: any) {
    document.body.classList.add('keyboard-will-show');

    const keyboardHeight = ev.keyboardHeight <= 0 ? DEFAULT_KEYBOARD_HEIGHT : ev.keyboardHeight;
    document.documentElement.style.setProperty('--keyboard-height', keyboardHeight  + 'px');
    this.events.publish('keyboard:willshow', ev);
  }

  private onKeyboardDidShow(ev: Event) {
    document.body.classList.add('keyboard-did-show');
    this.events.publish('keyboard:didshow', ev);
  }

  private onKeyboardWillHide() {
    document.documentElement.style.setProperty('--keyboard-height', '0px');
    document.body.classList.remove('keyboard-will-show');
    document.body.classList.remove('keyboard-did-show');
    document.body.classList.add('keyboard-will-hide');
    this.events.publish('keyboard:willhide');
  }

  private onKeyboardDidHide() {
    document.body.classList.remove('keyboard-will-hide');
    this.events.publish('keyboard:didhide');
  }
}
