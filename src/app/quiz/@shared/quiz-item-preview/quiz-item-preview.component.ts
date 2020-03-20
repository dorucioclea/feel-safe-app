/* eslint-disable @typescript-eslint/no-magic-numbers */
import { QuizService } from 'src/app/quiz/@shared/quiz.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { QuizItemModel } from 'src/app/quiz/@shared/quiz-item.model';
import { QuizItemOptionModel } from 'src/app/quiz/@shared/quiz-item-option.model';

const FLIP_TIMEOUT = 250;

@Component({
  selector: 'proto-quiz-item-preview',
  templateUrl: './quiz-item-preview.component.html',
  styleUrls: ['./quiz-item-preview.component.scss'],
})
export class QuizItemPreviewComponent implements OnInit {

  // Config
  public animatedTextEnabled: boolean = true;
  public optionFlipOnEverySwipe: boolean = true;
  public optionFlipDelay: number = 0.125; // 0 = all at the same time
  public optionFlipDirection: boolean = false; // true = first to last
  
  @Input() public item: QuizItemModel;
  @Input() public currentItem: QuizItemModel;

  @Output() public onSelect: EventEmitter<QuizItemOptionModel> = new EventEmitter();
  @Output() public onValidated: EventEmitter<any> = new EventEmitter();
  @Output() public onProceeded: EventEmitter<any> = new EventEmitter();

  public selectedOptions: string[] = [];
  public isMultiSelect: boolean = false;

  public correctOptions: string[] =[];
  public wrongOptions: string[] =[];

  public wasSelected: boolean = false;
  public wasValidated: boolean = false;
  public hasProceeded: boolean = false;

  public flipped: string[] = [];

  constructor(
    private quizService: QuizService) { }

  public ngOnInit(): void {
    this.isMultiSelect = this.item.options.filter((item) => item.isCorrect).length > 1;

    this.quizService.getValidation().subscribe((validatedItem) => {
      if(this.isCurrentItem(validatedItem))
        this.validate();
    })

    this.quizService.getSelectedItem().subscribe((selectedItem) => {
      this.flipAllOptions(selectedItem);
    })

  }

  public selectOption(option: QuizItemOptionModel): void {

    if(this.wasValidated) { return; }

    if(this.isMultiSelect) {
      this.toggleSelect(option);
    } else {
      this.singleSelect(option)
    }

    this.wasSelected = this.selectedOptions.length > 0;
    this.onSelect.emit(option);
  }

  public isSelected(id: string): boolean {
    return this.selectedOptions.includes(id);
  }

  public isCorrect(id: string): boolean {
    return this.correctOptions.includes(id);
  }

  public isWrong(id: string): boolean {
    return this.wrongOptions.includes(id);
  }

  public validate(): void {
    console.log('validate()-item')

    let correctTotal: boolean = true;

    this.item.options.map((option) => {

      const isCorrect = option.isCorrect;
      const isSelected = this.isSelected(option.id);

      if(isCorrect && isSelected) {
        this.markAs('correct', option);
      }

      if(isCorrect && !isSelected) {
        this.markAs('correct', option);
        correctTotal = false;
      }

      if(!isCorrect && isSelected) {
        this.markAs('wrong', option);
        correctTotal = false;
      }

    });

    this.onValidated.emit(correctTotal);
    this.wasValidated = true;
  }

  public proceed(): void {
    this.onProceeded.emit(true);
    this.hasProceeded = true;
  }

  public isFlipped(option: string): boolean {
    return this.flipped.includes(option);
  }

  public flipOption(state: string, option: any): void {
    switch (state) {
      case 'back':
        this.flipped.push(option);
        break;
      case 'front':
        this.flipped.splice(this.flipped.indexOf(option.id), 1);
        break;
      case 'toggle':
      default:
        this.flipOption(this.isFlipped(option) ? 'front' : 'back', option);
        break;
    }

  }

  public flipAllOptions(item: QuizItemModel): void {
    if(this.optionFlipOnEverySwipe) {
      this.item.options.forEach((option) => {
        setTimeout(() => {
          this.flipOption(this.isCurrentItem(item) ? 'back' : 'front', option);
        }, FLIP_TIMEOUT);
      });
      return;
    }

    if(this.isCurrentItem(item)) {
      this.item.options.forEach((option) => {
        setTimeout(() => {
          this.flipOption(undefined, option);
        }, FLIP_TIMEOUT);
      })
    }
  }

  private markAs(state: string, option: QuizItemOptionModel): void {
    switch (state) {
      case 'selected':
        this.selectedOptions.push(option.id)
        break;

      case 'correct':
        this.correctOptions.push(option.id);
        break;

      case 'wrong':
        this.wrongOptions.push(option.id);
        break;

      default:
        this.selectedOptions.splice(this.selectedOptions.indexOf(option.id), 1);
        this.correctOptions.splice(this.selectedOptions.indexOf(option.id), 1);
        this.wrongOptions.splice(this.selectedOptions.indexOf(option.id), 1);
        break;
    }
  }

  private toggleSelect(option: QuizItemOptionModel): void {
    if(this.isSelected(option.id)){
      return this.markAs(undefined, option)
    }
    this.markAs('selected', option);
  }

  private singleSelect(option: QuizItemOptionModel): void {
    this.selectedOptions = [];
    this.markAs('selected', option);
  }

  private isCurrentItem(item: QuizItemModel): boolean {
    return item === this.item;
  }
}
