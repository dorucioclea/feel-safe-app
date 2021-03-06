import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { C } from 'src/app/@shared/constants';
import { LanguageService } from 'src/app/@core/language.service';

@Component({
  selector: 'proto-language-switch',
  templateUrl: './language-switch.component.html',
  styleUrls: ['./language-switch.component.scss'],
})
export class LanguageSwitchComponent implements OnInit {
  public availableLanguages: string[];
  public currentLanguage: string;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
  ) { }

  public ngOnInit(): void {
    this.availableLanguages = C.availableLanguages.map((language) => language.toUpperCase());
    this.currentLanguage = this.translate.currentLang.toUpperCase();
  }

  public changeLanguage(event: any): void {
    const currentLanguage = this.currentLanguage;

    this.languageService.changeLanguage(event.detail.value.toLowerCase()).catch((error) => {
      console.error(error);
      this.currentLanguage = currentLanguage;
    });
  }
}
