import { QuizItemSource, QuizItemModel } from 'src/app/quiz/@shared/quiz-item.model';

export type QuizState = 'new' | 'started' | 'completed';

export interface QuizSource {
  id: string;
  title: string;
  imageId: string;
  items?: QuizItemSource[];
  createdAt: string;
  updatedAt: string;
}

export class QuizModel {
  public id: string;
  public title: string;
  public imageId: string;
  public items: QuizItemModel[];
  public state: QuizState;
  public createdAt: string;
  public updatedAt: string;

  constructor(source: QuizSource) {
    this.id = source.id;
    this.title = source.title;
    this.imageId = source.imageId;
    this.items = source.items ? source.items.map((item, index) => new QuizItemModel(item, index)) : [];
    this.createdAt = source.createdAt;
    this.updatedAt = source.updatedAt;
  }
}

export const QUIZ_DUMMY_DATA: QuizModel[] = [
  {
    id: 'yrm9dY6yiDeF1',
    title: 'bears',
    imageId: '234567898765432',
    items: [
      {
        id: 'f7inorumri',
        quizId: 'yrm9dY6yiDeF1',
        type: 'boolean',
        question: 'Which bear is in danger?',
        autoValidate: false,
        autoProceed: 3000,
        index: 0,
        options: [
          {
            id: 'd6f7guz8ihoj',
            quizItemId: 'f7inorumri',
            text: 'The proto bear',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: false,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          },
          {
            id: 'd6f7g7bn8uz8ihoj',
            quizItemId: 'f7inorumri',
            text: 'The corona bear',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: true,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          },
        ],
        createdAt: 'vu7bi6z7nuo',
        updatedAt: 'cvru6bgizhno',
      },
      {
        id: 'f7inoru9h8ojimri',
        quizId: 'yrm9dY6yiDeF1',
        type: 'boolean',
        question: 'What does a proto bear eat?',
        autoValidate: 4000,
        autoProceed: 2000,
        index: 1,
        options: [
          {
            id: 'd6f7guzbteb83r2ihoj',
            quizItemId: 'f7inoru9h8ojimri',
            text: 'Code',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: true,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          },
          {
            id: 'd6f7guz8iho43dsrf4j',
            quizItemId: 'f7inoru9h8ojimri',
            text: 'Kot',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: false,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          }
        ],
        createdAt: 'vu7bi6z7nuo',
        updatedAt: 'cvru6bgizhno',
      },
      {
        id: 'f7inoru9h8oj7h7himri',
        quizId: 'yrm9dY6yiDeF1',
        type: 'boolean',
        question: 'Where do proto bears live?',
        autoValidate: 5000,
        autoProceed: false,
        index: 2,
        options: [
          {
            id: 'd6f7guzbteb83r9872ihoj',
            quizItemId: 'f7inoru9h8oj7h7himri',
            text: 'Git',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: true,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          },
          {
            id: 'd6f7g4df5g6uz8iho43dsrf4j',
            quizItemId: 'f7inoru9h8oj7h7himri',
            text: 'Helgoland',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: false,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          },
          {
            id: 'd6f7g4df5g6uz8iho43dsrf4j',
            quizItemId: 'f7inoru9h8oj7h7himri',
            text: 'Office',
            imageId: '54ju89gerergeeg',
            option: false,
            isCorrect: true,
            createdAt: 'd4567fr8gtzh9uigft',
            updatedAt: '345rv67t8zioutcdrv',
          }
        ],
        createdAt: 'vu7bi6z7nuo',
        updatedAt: 'cvru6bgizhno',
      }
    ],
    state: 'new',
    createdAt: '5fzr687gh',
    updatedAt: 'h7g6rgthj',
  },

];