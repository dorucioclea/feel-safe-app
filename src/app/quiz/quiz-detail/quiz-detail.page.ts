import { Router } from '@angular/router';
import { InAppBrowserService } from 'src/app/@core/in-app-browser.service';
import { TranslateService } from '@ngx-translate/core';
import { SharingService } from './../../@core/sharing.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { QuizModel, QUIZ_DUMMY_DATA } from '../@shared/quiz.model';
import { QuizService, QuizResults } from '../@shared/quiz.service';
import { QuizItemOptionModel } from 'src/app/quiz/@shared/quiz-item-option.model';
import { QuizItemModel } from 'src/app/quiz/@shared/quiz-item.model';

const INTERVAL = 1000 // ms

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-quiz-detail',
  templateUrl: './quiz-detail.page.html',
  styleUrls: ['./quiz-detail.page.scss'],
})
export class QuizDetailPage implements OnInit {
  public initialized: boolean = false;

  public id: string;
  public isLoading: boolean = true;

  public quiz: QuizModel;
  public results: QuizResults;
  public item: QuizItemModel;

  public isSelected: boolean = false;

  public validationCountdown: number;
  public wasValidated: boolean = false;

  public proceedingCountdown: number;
  public hasProceeded: boolean = false;

  public correctItems: string[] = [];
  public wrongItems: string[] = [];

  public isLastSlide: boolean = false;
  public activeSlideIndex: number = 0;

  // Config
  public lockSwipes: boolean = false;

  public showIndicator: boolean = true;
  public animateIndicator: boolean = true;

  public slides: IonSlides;
  @ViewChild('slides', { static: false }) set content(slides: IonSlides) {
    if(!slides) { return; }
    this.slides = slides;

    if(this.lockSwipes) {
      this.slides.lockSwipeToNext(true).catch();
    }
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private quizService: QuizService,
    private sharingService: SharingService,
    private translateService: TranslateService,
    private router: Router,
    private inAppBrowserService: InAppBrowserService,
    private modalController: ModalController,
  ) { }

  public ngOnInit(): void {
    // this.id = this.navParams.get('id');


    this.quiz = QUIZ_DUMMY_DATA[0];
    this.item = this.quiz.items[this.activeSlideIndex];

    this.quizService.selectItem(this.item);
    this.isLoading = false;

  }

  public ionViewDidEnter(): void {
    if (this.initialized) { return; }

    this.initialized = true;

   /*  this.quiz = QUIZ_DUMMY_DATA[0];
    this.item = this.quiz.items[this.activeSlideIndex];

    this.quizService.selectItem(this.item);
    this.isLoading = false; */

  /*   this.quizService.getQuizById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((quiz) => {

        this.quiz = QUIZ_DUMMY_DATA[0];
        console.log(this.quiz);
        // this.quiz = quiz;
        
        this.item = this.quiz.items[this.activeSlideIndex];
        this.quizService.selectItem(this.item);
        this.isLoading = false;
      }); */
  }

  public selectOption(option: QuizItemOptionModel, item: QuizItemModel): void {

/*     this.quizService.selectOption(option, item);

    if (item.index === 0) {
      this.quizService.updateQuizState(this.quiz.id, 'started');
    }

    if (item.index === this.quiz.items.length - 1) {
      this.quizService.updateQuizState(this.quiz.id, 'completed');
    } */

    this.isSelected = true;
  }

  public wasActive(i: number): boolean {
    return this.activeSlideIndex >= i;
  }

  public isCorrect(id: string): boolean {
    return this.correctItems.includes(id);
  }

  public isWrong(id: string): boolean {
    return this.wrongItems.includes(id);
  }

  public validate(): void {
    this.quizService.validate(this.item);
    this.handleAutoProceeding();
  }

  public onValidated(totalResult: any): void {
    if(totalResult) {
      this.correctItems.push(this.item.id)
    } else {
      this.wrongItems.push(this.item.id)
    }
    this.wasValidated = true;
  }

  public async proceed(): Promise<any> {
    this.wasValidated = false;
    this.hasProceeded = true;

    if(this.lockSwipes) {
      await this.slides.lockSwipes(false).catch();
      await this.slides.slideNext().catch();
      await this.slides.lockSwipes(true).catch();
    } else {
      await this.slides.slideNext().catch();
    }
  }

  public onProceeded(totalResult: any): void {
    if(totalResult) {
      this.correctItems.push(this.item.id)
    } else {
      this.wrongItems.push(this.item.id)
    }
    this.hasProceeded = true;
  }

  public slideTo(index: number): void {
    this.slides.slideTo(index).catch();
  }

  public async slidesWillChange(): Promise<any> {
    const length = await this.slides.length();
    const currentIndex = await this.slides.getActiveIndex();
    this.activeSlideIndex = currentIndex;
    this.item = this.quiz.items[this.activeSlideIndex];

    this.handleAutoValidation();

    this.quizService.selectItem(this.item);
    if(currentIndex === length - 1) {
      this.isLastSlide = true;
    } else {
      this.isLastSlide = false;
    }
    this.isSelected = false;
  }

  private handleAutoValidation(): void {
    // Handle autoValidate
    if(this.item.autoValidate) {
      this.validationCountdown = this.item.autoValidate;
      const interval = setInterval(() => {
        this.validationCountdown = this.validationCountdown - INTERVAL;
        if(this.validationCountdown === 0) {
          this.validate();
          clearInterval(interval);
        }
      }, INTERVAL);
    }
  }

  private handleAutoProceeding(): void {
    // Handle autoProceed
    if(this.item.autoProceed) {
      this.proceedingCountdown = this.item.autoProceed;
      const interval = setInterval(() => {
        this.proceedingCountdown = this.proceedingCountdown - INTERVAL;
        if(this.proceedingCountdown === 0) {
          this.proceed();
          clearInterval(interval);
        }
      }, INTERVAL);
    }
  }
}
