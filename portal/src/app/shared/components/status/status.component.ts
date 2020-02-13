import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lms-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  @Input() value = 0;
  constructor() {}

  ngOnInit() {}
}
