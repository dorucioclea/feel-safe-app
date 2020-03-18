import { QuizItemOptionSource, QuizItemOptionModel } from 'src/app/quiz/@shared/quiz-item-option.model';

export type QuizItemType = 'boolean' | 'text' | 'image' | 'info';
export type QuizItemAutoValidation = number | false;
export type QuizItemAutoProceeding = number | false;

export interface QuizItemSource {
  id: string;
  quizId: string;
  type: QuizItemType;
  question: string;
  options?: QuizItemOptionSource[];
  autoValidate: QuizItemAutoValidation;
  autoProceed: QuizItemAutoProceeding;
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
  public autoValidate: QuizItemAutoValidation;
  public autoProceed: QuizItemAutoProceeding;
  public createdAt: string;
  public updatedAt: string;

  constructor(source: QuizItemSource, index?: number) {
    this.id = source.id;
    this.quizId = source.quizId;
    this.type = source.type;
    this.question = source.question;
    this.options = source.options ? source.options.map((option) => new QuizItemOptionModel(option)) : [];
    this.index = index;
    this.autoValidate = source.autoValidate;
    this.autoProceed = source.autoProceed;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
