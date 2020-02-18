import { Directive } from '@angular/core';
import { Platform } from '@ionic/angular';

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
    private platform: Platform,
  ) { }

  public ngOnInit(): void {
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

  public ngOnDestroy(): void {
    window.removeEventListener('keyboardWillShow', this.keyboardWillShow);
    window.removeEventListener('keyboardDidShow', this.keyboardDidShow);
    window.removeEventListener('keyboardWillHide', this.keyboardWillHide);
    window.removeEventListener('keyboardDidHide', this.keyboardDidHide);
  }

  private onKeyboardWillShow(ev: any): void {
    document.body.classList.add('keyboard-will-show');

    const keyboardHeight = ev.keyboardHeight <= 0 ? DEFAULT_KEYBOARD_HEIGHT : ev.keyboardHeight;
    document.documentElement.style.setProperty('--keyboard-height', keyboardHeight  + 'px');
  }

  private onKeyboardDidShow(): void {
    document.body.classList.add('keyboard-did-show');
  }

  private onKeyboardWillHide(): void {
    document.documentElement.style.setProperty('--keyboard-height', '0px');
    document.body.classList.remove('keyboard-will-show');
    document.body.classList.remove('keyboard-did-show');
    document.body.classList.add('keyboard-will-hide');
  }

  private onKeyboardDidHide(): void {
    document.body.classList.remove('keyboard-will-hide');
  }
}
