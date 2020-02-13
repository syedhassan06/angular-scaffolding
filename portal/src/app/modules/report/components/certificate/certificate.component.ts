import { capitalize } from './../../../../shared/utils/helper';
import { PrincipalService } from '@portal/core/services/principal.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@portal/core/services';
import { ICourseStats } from '@portal/core/models';
import * as jsPDF from 'jspdf';
import html2canvas = require('html2canvas');
window['html2canvas'] = html2canvas;

@Component({
  selector: 'lms-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  user$ = this.authService.user$;
  user = this.principalService.getUserIdentity();
  _course: ICourseStats = null;
  @Input()
  set course(data: ICourseStats) {
    this._course = data;
    if (data) {
      this.generatePdf();
    }
  }
  get course() {
    return this._course;
  }
  @Output() resetPDF$ = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private principalService: PrincipalService
  ) {}

  ngOnInit() {}

  generatePdf() {
    const div = document.getElementById('armd-course-certificate');
    const options = {
      background: 'white',
      //height: div.clientHeight,
      width: div.clientWidth
    };
    html2canvas(div, options).then(canvas => {
      //Initialize JSPDF
      const doc = new jsPDF('l', 'px', 'a4');
      //Converting canvas to Image
      const imgData = canvas.toDataURL('image/jpeg');
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      //Add image Canvas to PDF
      doc.addImage(imgData, 'JPG', 0, 0, width, height);

      const pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      const buffer = new ArrayBuffer(pdfOutput.length);
      const array = new Uint8Array(buffer);
      for (let i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }
      //Name of pdf
      const fileName = this.getFileName();
      // Make file
      doc.save(fileName);
      setTimeout(() => {
        this.reset();
      }, 200);
    });
  }

  reset() {
    this.resetPDF$.emit(true);
  }

  getFileName() {
    return (
      'Certificate_' +
      capitalize(this._course.first_name || this.user.first_name) +
      capitalize(this._course.last_name || this.user.last_name) +
      '_' +
      capitalize(this._course.title.replace(/(\/|\-|[ ]|\_)/g, ' ')).replace(
        /[ ]/g,
        ''
      )
    ); //+'_'+
    //capitalize(this._course.title.replace(/(\/|\-|[ ]|_)/g," ")).replace(/[ ]/g,"")
    //this._course.completion_date.replace(/\//g,"-");
  }
}
