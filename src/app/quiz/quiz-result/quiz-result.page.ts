import { QuizService } from 'src/app/quiz/@shared/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { HideSplash } from 'src/app/@shared/hide-splash.decorator';
import { PageTrack } from 'src/app/@shared/page-track.decorator';

@PageTrack()
@HideSplash()
@Component({
  selector: 'page-quiz-result',
  templateUrl: './quiz-result.page.html',
  styleUrls: ['./quiz-result.page.scss'],
})
export class QuizResultPage implements OnInit {
  public id: string;
  public results: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private quizService: QuizService,
  ) { }

  public ngOnInit(): void{ 
    this.id = this.activatedRoute.snapshot.params.id;
    console.log(this.id)
  }


  public ionViewDidEnter(): void {
    console.log('')
    this.results = this.quizService.getResults(this.id);

    console.log('---results----')
    console.log(this.results);
  }
}
