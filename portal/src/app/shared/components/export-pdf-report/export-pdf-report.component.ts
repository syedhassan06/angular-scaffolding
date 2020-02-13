import { Component, OnInit, Input } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Table } from 'primeng/table';
import { deepCopy } from '@portal/shared/utils/helper';

@Component({
  selector: 'lms-export-pdf-report',
  templateUrl: './export-pdf-report.component.html',
  styleUrls: ['./export-pdf-report.component.scss']
})
export class ExportPdfReportComponent implements OnInit {
  @Input() cols: any[] = [];
  @Input() title = '';
  @Input() header = null;
  @Input()
  set table(data) {
    if (data) {
      this._table = data;
    }
  }
  get table() {
    return this._table;
  }
  private _table: Table;
  doc: any = null;
  imageLogo = '';
  constructor() {}

  ngOnInit() {}

  pdfExport() {
    let body = [];
    const totalPagesExp = '{total_pages_count_string}';
    const columns = [];
    let marginTop = 80;
    let headerPositionTop = 90;
    const filteredCols = { length: 0 };
    const headerElements = [];

    if (this.header && this.header.name === 'report-card') {
      Object.keys(this.header).forEach((keyIndex: any, i) => {
        if (this.header[keyIndex] && this.header[keyIndex]['text']) {
          filteredCols.length += 1;
        }
      });
      if (filteredCols.length === 1) {
        headerPositionTop = 70;
      }
      Object.keys(this.header).forEach((keyIndex: any, i) => {
        if (this.header[keyIndex] && this.header[keyIndex]['text']) {
          marginTop += 18;
          if (i !== 0) headerPositionTop += 15;
          headerElements.push({
            text: this.header[keyIndex]['text'],
            positionTop: headerPositionTop
          });
        }
      });
    }

    this.cols.forEach(
      item =>
        item.field && columns.push({ header: item.header, dataKey: item.field })
    );
    if (
      Array.isArray(this.table.filteredValue) &&
      this.table.filteredValue.length > 0
    ) {
      body = deepCopy(this.table.filteredValue);
    } else if (Array.isArray(this.table.value) && this.table.value.length > 0) {
      body = deepCopy(this.table.value);
    }
    body.map(item => {
      if (item.progress) {
        item.progress += '%';
        return item;
      }
      return item;
    });
    const jspdf = new jsPDF('l', 'pt', 'a4');
    this.doc = jspdf;
    (<any>jspdf).autoTable({
      margin: { top: marginTop, left: 20 },
      //startY:70,
      body: body,
      columns: columns,
      headStyles: {
        fillColor: '#212529',
        textColor: '#ffffff'
      },
      styles: {
        cellWidth: 10,
        overflow: 'linebreak'
      },
      rowPageBreak: 'avoid',
      showHead: 'everyPage',
      didDrawPage: data => {
        // HEADER
        var img = document.createElement('img');
        img.src = 'assets/img/logo-green.png';
        this.doc.addImage(img, 'PNG', data.settings.margin.left, 14, 0, 45, 17);

        if (this.header && this.header.name === 'report-card') {
          this.doc.setFontSize(11).setTextColor(60);
          headerElements.forEach(item => {
            this.doc.text(20, item.positionTop, item.text);
          });
        }
        // FOOTER
        var str = 'Page ' + data.pageNumber;
        if (typeof this.doc.putTotalPages === 'function') {
          str = str + ' of ' + totalPagesExp;
        }
        this.doc.setFontSize(9);
        this.doc.text(
          str,
          data.settings.margin.left,
          this.doc.internal.pageSize.height - 10
        );
      }
    });

    if (typeof this.doc.putTotalPages === 'function') {
      this.doc.putTotalPages(totalPagesExp);
    }
    const filename = this.table.exportFilename + '_' + new Date().getTime();
    jspdf.save(filename || this.title || 'report.pdf');
  }
}
