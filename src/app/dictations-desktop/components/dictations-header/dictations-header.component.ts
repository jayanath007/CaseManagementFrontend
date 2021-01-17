import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-dictations-header',
  templateUrl: './dictations-header.component.html',
  styleUrls: ['./dictations-header.component.scss']
})
export class DictationsHeaderComponent implements OnInit {
  @Input() myJobList: any;   // to add interface
  @Input() jobStageList: any;   // to add interface
  constructor() { }

  ngOnInit() {
  }


  onMyJobChange(value){

  }

  onJobStageChange(value){

  }

}
