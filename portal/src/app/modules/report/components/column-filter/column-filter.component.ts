import { Component, OnInit, Input } from '@angular/core';
import { Table } from 'primeng/table';
interface IColumnType {
  field?: string;
  header?: string;
  filterType?: string;
  filter?: boolean;
  filterMatchMode?: string;
  options?: any[];
}
@Component({
  selector: '[lms-column-filter]',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss']
})
export class ColumnFilterComponent implements OnInit {
  @Input()
  set table(data) {
    this._table = data;
  }
  get table() {
    return this._table;
  }
  @Input()
  set cols(data: IColumnType[]) {
    if (Array.isArray(data)) {
      this._cols = data;
      data.forEach((item: IColumnType, index) => {
        this.dateCols[index] = '';
        if (item.filterType === 'date') {
          this.dateCols[index] = null;
          this.dateFilter(index);
        }
      });
    }
  }
  get cols() {
    return this._cols;
  }
  private _table: Table;
  private _cols: IColumnType[] = [];
  dateCols: any[] = [];

  constructor() {}

  ngOnInit() {}

  dateFilter(index: number) {
    const _self = this;
    this.table.filterConstraints['dateRangeFilter' + index] = (
      value,
      filter
    ): boolean => {
      if (!value) {
        return false;
      }
      if (typeof value === 'string') {
        value = new Date(<any>value);
      }
      // get the from/start value
      const s = _self.dateCols[index][0].getTime();
      let e;
      // the to/end value might not be set
      // use the from/start date and add 1 day
      // or the to/end date and add 1 day
      if (_self.dateCols[index][1]) {
        e = _self.dateCols[index][1].getTime() + 86400000;
      } else {
        e = s + 86400000;
      }
      // compare it to the actual values
      return value.getTime() >= s && value.getTime() <= e;
    };
  }
}
