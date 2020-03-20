import { QuizItemOptionSource, QuizItemOptionModel } from 'src/app/quiz/@shared/quiz-item-option.model';

export type QuizItemType = 'boolean' | 'text' | 'image' | 'info';
export type QuizItemAutoValidation = number;
export type QuizItemAutoProceeding = number;

export interface QuizItemSource {
  id: string;
  quizId: string;
  type: QuizItemType;
  question: string;
  options?: QuizItemOptionSource[];
  // autoValidate: QuizItemAutoValidation;
  enableAutoValidation: boolean;
  autoValidationDuration: number;
  showValidationButton: boolean;
  // autoProceed: QuizItemAutoProceeding;
  enableAutoProceeding: boolean;
  autoProceedingDuration: number;
  showProceedingButton: boolean;

  createdAt: string;
  updatedAt: string;
}

export class QuizItemModel {
  public id: string;
  public quizId: string;
  public type: string;
  public question: string;
  public options: QuizItemOptionModel[];
  public index: number;

  // public autoValidate: QuizItemAutoValidation;
  public enableAutoValidation: boolean;
  public autoValidationDuration: number;
  public showValidationButton: boolean;
  // autoProceed: QuizItemAutoProceeding;
  public enableAutoProceeding: boolean;
  public autoProceedingDuration: number;
  public showProceedingButton: boolean;

  // public autoProceed: QuizItemAutoProceeding;

  public createdAt: string;
  public updatedAt: string;

  constructor(source: QuizItemSource, index?: number) {
    this.id = source.id;
    this.quizId = source.quizId;
    this.type = source.type;
    this.question = source.question;
    this.options = source.options ? source.options.map((option) => new QuizItemOptionModel(option)) : [];
    this.index = index;

    this.enableAutoValidation = source.enableAutoValidation;
    this.autoValidationDuration = source.autoValidationDuration;
    this.showValidationButton = source.showValidationButton;

    this.enableAutoProceeding = source.enableAutoProceeding;
    this.autoProceedingDuration = source.autoProceedingDuration;
    this.showProceedingButton = source.showProceedingButton;

    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
