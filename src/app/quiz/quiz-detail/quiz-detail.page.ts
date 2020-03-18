import { Router, ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';
import { QuizModel } from '../@shared/quiz.model';
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
    private router: Router,
    private quizService: QuizService,
    private activatedRoute: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
  }

  public ionViewDidEnter(): void {
    if (this.initialized) { return; }

    this.initialized = true;

    this.quizService.getQuizById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((quiz) => {
        this.quiz = quiz;
        console.log(this.quiz);
        
        this.item = this.quiz.items[this.activeSlideIndex];
        this.quizService.selectItem(this.item);

        this.handleAutoValidation();
        this.isLoading = false;
      });
  }

  public selectOption(option: QuizItemOptionModel, item: QuizItemModel): void {
    this.quizService.selectOption(option, item);

    if (item.index === 0) {
      this.quizService.updateQuizState(this.quiz.id, 'started');
    }

    if (item.index === this.quiz.items.length - 1) {
      this.quizService.updateQuizState(this.quiz.id, 'completed');
    }

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

  public onValidated(totalResults: any): void {
    if(totalResults) {
      this.correctItems.push(this.item.id)
    } else {
      this.wrongItems.push(this.item.id)
    }
    this.wasValidated = true;
  }

  public async proceed(): Promise<any> {
    this.wasValidated = false;
    this.hasProceeded = true;

    if(this.isLastSlide) {

      this.router.navigate(['main/quizzes-results', this.id])
      return;
    } 

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
