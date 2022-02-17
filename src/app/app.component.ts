import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { Component, AfterViewInit } from '@angular/core';
// import * as Handsontable from 'handsontable';

let isChecked = false;

class CustomEditor extends Handsontable.editors.TextEditor {
  setValue(newValue) {
    const striphtml = newValue.replace(/<[^>]+>/g, '');
    this.TEXTAREA.value = striphtml;
    this.TEXTAREA.style.background = 'yellow';
    console.log(this.TEXTAREA);
  }
  getValue() {
    const striphtml = this.TEXTAREA.value;
    const exp =
      /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let temp = striphtml.replace(exp, '<a href="$1" target="_blank">$1</a>');
    return (this.TEXTAREA.value = temp);
  }
  focus() {
    super.focus();
    this.TEXTAREA.select();
  }
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  id = 'hotInstance';
  totalColumns: any;
  totalRows: any;
  newCellValue: any;
  columnName: any;
  changedrow: any = 0;
  languages = 'ja-JP';
  //languages = Handsontable.languages.getLanguagesDictionaries();
  private hotRegisterer = new HotTableRegisterer();
  hotData = [[]];
  data = [
    {
      title:
        "<a href='http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691'>Professional JavaScript for Web Developers</a>",
      description:
        "This <a href='http://bit.ly/sM1bDf'>book</a> provides a developer-level introduction along with more advanced and useful features of <b>JavaScript</b>.",
    },
    {
      title:
        "<a href='http://shop.oreilly.com/product/9780596517748.do'>JavaScript: The Good Parts</a>",
      description:
        'This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.',
    },
    {
      title:
        "<a href='http://shop.oreilly.com/product/9780596805531.do'>JavaScript: The Definitive Guide</a>",
      description:
        '<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.',
    },
  ];
  hotSettings: Handsontable.GridSettings = {
    data: this.data,
    colHeaders: function (col) {
      let txt;
      switch (col) {
        case 0:
          txt = "<input type='checkbox' class='checker' ";
          txt += isChecked ? 'checked="checked"' : '';
          txt += '>';
          return txt;
      }
    },
    rowHeaders: true,
    contextMenu: true,
    height: 400,
    columns: [
      {
        data: '',
        type: 'checkbox',
      },
      {
        data: 'title',
        renderer: 'html',
        title: 'title',
      },
      {
        data: 'description',
        title: 'description',
        editor: CustomEditor,
        renderer: 'html',
      },
    ],
  };
  statusRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.HtmlRenderer.apply(this, arguments);
    td.innerHTML = '<a href="">' + value + '</a>';
    return td;
  }

  ngAfterViewInit() {
    //this.languages[0].languageCode = 'ja-JP';
  }

  export() {
    let exportPlugin1 = this.hotRegisterer
      .getInstance(this.id)
      .getPlugin('exportFile');
    exportPlugin1.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      fileExtension: 'csv',
      filename: 'CSV-file_[DD]-[MM]-[YYYY]',
      mimeType: 'text/text',
      rowDelimiter: '\r\n',
      rowHeaders: false,
    });
  }

  localAfterOnCellMouseDown = (event, coords, td) => {
    if (event.realTarget.classList.contains('contextMenu')) {
      //  this.showContextMenu(event, coords);
    } else if (event.realTarget.classList.contains('checker')) {
      this.headerCheckbox(event, coords);
    }
  };
  headerCheckbox(event, coords) {
    const totalRows = this.hotRegisterer.getInstance(this.id).countRows();
    if (!isChecked) {
      isChecked = true;
      for (let index = 0; index < totalRows; index++) {
        this.hotRegisterer.getInstance(this.id).setDataAtCell(index, 0, true);
      }
    } else {
      isChecked = false;
      for (let index = 0; index < totalRows; index++) {
        this.hotRegisterer.getInstance(this.id).setDataAtCell(index, 0, false);
      }
    }
  }
}
