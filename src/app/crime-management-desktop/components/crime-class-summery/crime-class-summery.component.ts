import { Component, OnInit, Input } from '@angular/core';
import { ClassTotalsViewModel } from '../../../crime-management-core/models/interfaces';

@Component({
  selector: 'dps-crime-class-summery',
  templateUrl: './crime-class-summery.component.html',
  styleUrls: ['./crime-class-summery.component.scss']
})
export class CrimeClassSummeryComponent implements OnInit {

  constructor() { }
  @Input() summery: ClassTotalsViewModel;

  ngOnInit() {
  }

}
