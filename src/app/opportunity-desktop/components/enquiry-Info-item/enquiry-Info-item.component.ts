import { Component, OnInit, Input } from '@angular/core';
import { OpportunityApiTypeDetailsViewModel } from '../../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-enquiry-Info-item',
  templateUrl: './enquiry-Info-item.component.html',
  styleUrls: ['./enquiry-Info-item.component.scss']
})
export class EnquiryInfoItemComponent implements OnInit {

  @Input() item: OpportunityApiTypeDetailsViewModel;
  @Input() isOdd: boolean;

  constructor() { }

  ngOnInit() {
  }

  // isBooleanField(answer: string) {
  //   if (!!answer && answer.toString() && (answer.toString().toLowerCase() === 'true'
  //     || answer.toString().toLowerCase() === 'false')) {
  //     return false;
  //   }
  //   return false;
  // }

}
