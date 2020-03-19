import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';

import { ProtoItems } from 'src/app/@shared/proto-items.interface';
import { QuizItemModel } from 'src/app/quiz/@shared/quiz-item.model';
import { QuizItemOptionModel } from 'src/app/quiz/@shared/quiz-item-option.model';
import { QuizModel, QuizSource, QuizState } from './quiz.model';
import { StorageService } from 'src/app/@core/storage.service';
import { URL } from 'src/app/@shared/url';

export interface Quizzes extends ProtoItems {
  items: QuizModel[];
}

interface QuizzesByIdStore {
  [key: string]: QuizModel;
}

interface QuizzesById {
  [key: string]: BehaviorSubject<QuizModel>;
}

interface QuizStates {
  [key: string]: QuizState;
}

export interface QuizResults {
  correctAnswers: number;
  wrongAnswers: number;
}

const DEFAULT_LIMIT = 10;

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizzesStore: Quizzes = null;
  private quizzes: BehaviorSubject<Quizzes> = new BehaviorSubject(null);
  private quizzesByIdStore: QuizzesByIdStore = {};
  private quizzesById: QuizzesById = {};

  private validation: BehaviorSubject<QuizItemModel> = new BehaviorSubject(null);

  private selectedItem: BehaviorSubject<QuizItemModel> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private storage: StorageService,
  ) { }

  public getQuizById(quizId: string): Observable<QuizModel> {

    console.log()
    if (this.quizzesById[quizId]) {
      return this.quizzesById[quizId].asObservable();
    }

    return this.loadQuizById(quizId).pipe(mergeMap(() => {
      return this.quizzesById[quizId].asObservable();
    }));
  }

  public refreshQuizById(quizId: string): void {
    this.loadQuizById(quizId).toPromise().catch((error) => {
      console.error(`Error refreshing quiz ${quizId}`);
      console.error(error);
    });
  }

  public getQuizzes(): Observable<Quizzes> {
    this.quizzesStore = { items: [], meta: { isFirstLoad: true, isLoading: true } };
    this.quizzes.next(this.quizzesStore);

    this.loadQuizzes().toPromise().catch((error) => {
      console.error(error);

      this.quizzesStore.meta.error = error;
      this.quizzesStore.meta.isLoading = false;

      this.quizzes.next(this.quizzesStore);
    });

    return this.quizzes.asObservable();
  }

  public getMoreQuizzes(): void {
    this.quizzesStore.meta.isLoading = true;
    this.quizzes.next(this.quizzesStore);

    this.loadQuizzes(this.quizzesStore.items.length).toPromise().catch((error) => {
      console.error(error);

      this.quizzesStore.meta.error = error;
      this.quizzesStore.meta.isLoading = false;

      this.quizzes.next(this.quizzesStore);
    });
  }

  public refreshQuizzes(): void {
    if (!this.quizzesStore) { return; }

    this.quizzesStore.meta.isLoading = true;
    this.quizzes.next(this.quizzesStore);

    this.loadQuizzes().toPromise().catch((error) => {
      console.error(error);
      
      this.quizzesStore.meta.error = error;
      this.quizzesStore.meta.isLoading = false;

      this.quizzes.next(this.quizzesStore);
    });
  }

  public selectOption(option: QuizItemOptionModel, item: QuizItemModel): void {
    const storageKey = `selectedOptions_${item.quizId}`;

    const selectedOptions = this.storage.get(storageKey, {});

    selectedOptions[item.id] = option.id;

    this.storage.set(storageKey, selectedOptions);
  }

  public updateQuizState(id: string, state: QuizState): void {
    const quizStates = this.getQuizStates();

    quizStates[id] = state;

    this.storage.set('quizStates', quizStates);

    this.quizzesByIdStore[id].state = state;
    this.quizzesById[id].next(this.quizzesByIdStore[id]);

    if (!this.quizzesStore) { return; }

    this.quizzesStore.items.some((quiz) => {
      if (quiz.id === id) {
        quiz.state = state;

        return true;
      }
    });
    this.quizzes.next(this.quizzesStore);
  }

  public resetQuiz(id: string): void {
    this.storage.remove(`selectedOptions_${id}`);
  }

  public getResults(quizId: string): QuizResults {
    const items = this.quizzesByIdStore[quizId].items;
    const selectedOptions = this.storage.get(`selectedOptions_${quizId}`, {});
    const results: QuizResults = {
      correctAnswers: 0,
      wrongAnswers: 0,
    };

    for (const item of items) {
      const correctOption = item.options.find((option) => option.isCorrect);

      if (correctOption.id === selectedOptions[item.id]) {
        results.correctAnswers++;
      }

      if (correctOption.id !== selectedOptions[item.id]) {
        results.wrongAnswers++;
      }
    }

    return results;
  }

  public validate(item: QuizItemModel): void {
    return this.validation.next(item);
  }

  public getValidation(): Observable<any> {
    return this.validation.asObservable();
  }

  public selectItem(item: QuizItemModel): void {
    return this.selectedItem.next(item);
  }

  public getSelectedItem(): Observable<any> {
    return this.selectedItem.asObservable();
  }

  private loadQuizzes(skip: number = 0, limit: number = DEFAULT_LIMIT): Observable<QuizModel[]> {
    const filter = {
      skip: skip,
      limit: limit,
      include: {
        relation: 'items',
        scope: { include: { relation: 'options' } },
      },
    };

    let totalCount = 0;

    return this.http.get(URL.quizzes({ filter }), { observe: 'response' })
      .pipe(
        tap((response: any) => {
          const headers: HttpHeaders = response.headers;
          totalCount = parseInt(headers.get('x-total-count'));
        }),
        map((response: any) => response.body),
        map((quizzes: QuizSource[]) => quizzes.map((quiz) => new QuizModel(quiz))),
        tap((quizzes) => {
          for (const quiz of quizzes) {
            quiz.state = this.getQuizStateById(quiz.id);
          }

          return quizzes;
        }),
        tap((quizzes: QuizModel[]) => {
          const items = skip ? this.quizzesStore.items.concat(quizzes) : quizzes;
          const hasMore = items.length < totalCount;
          this.quizzesStore = { items: items, meta: { hasMore: hasMore, totalCount: totalCount, isLoading: false } };

          this.quizzes.next(this.quizzesStore);
        }),
        tap((quizzes) => {
          this.updateQuizzesById(quizzes);
        }),
      );
  }

  private loadQuizById(quizId: string): Observable<QuizModel> {
    const filter = {
      include: {
        relation: 'items',
        scope: { include: { relation: 'options' } },
      },
    };

    return this.http.get<QuizSource>(URL.quizById(quizId, { filter }))
      .pipe(
        map((quiz) => new QuizModel(quiz)),
        tap((quiz) => {
          quiz.state = this.getQuizStateById(quiz.id);

          this.quizzesByIdStore[quiz.id] = quiz;

          if (!this.quizzesById[quiz.id]) {
            this.quizzesById[quiz.id] = new BehaviorSubject(null);
          }

          this.quizzesById[quiz.id].next(this.quizzesByIdStore[quiz.id]);
        }),
      );
  }

  private updateQuizzesById(quizzes: QuizModel[]): void {
    quizzes.forEach((quiz) => {
      this.quizzesByIdStore[quiz.id] = quiz;
      
      if (!this.quizzesById[quiz.id]) {
        this.quizzesById[quiz.id] = new BehaviorSubject(null);
      }

      this.quizzesById[quiz.id].next(this.quizzesByIdStore[quiz.id]);
    });
  }

  private getQuizStates(): QuizStates {
    return this.storage.get('quizStates', {});
  }

  private getQuizStateById(id: string): QuizState {
    const quizStates = this.getQuizStates();

    return quizStates[id] || 'new';
  }
}
