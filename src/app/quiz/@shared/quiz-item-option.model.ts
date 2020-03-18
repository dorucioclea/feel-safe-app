export interface QuizItemOptionSource {
  id: string;
  quizItemId: string;
  text: string;
  imageId: string;
  option: boolean;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
}

export class QuizItemOptionModel {
  public id: string;
  public quizItemId: string;
  public text: string;
  public imageId: string;
  public option: boolean;
  public isCorrect: boolean;
  public createdAt: string;
  public updatedAt: string;

  constructor(source: QuizItemOptionSource) {
    this.id = source.id;
    this.quizItemId = source.quizItemId;
    this.text = source.text;
    this.imageId = source.imageId;
    this.option = source.option;
    this.isCorrect = source.isCorrect;
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}
