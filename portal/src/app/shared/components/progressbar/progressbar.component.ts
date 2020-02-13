import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lms-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent implements OnInit {
  @Input() value = 0;
  constructor() {}

  ngOnInit() {}
}
