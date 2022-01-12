import {Component, EventEmitter , Injectable,
  Output,
  Input,
  OnInit,
  ElementRef,
  Renderer2} from '@angular/core';
import {DataPageEventInformation, PageEventType} from './page-navigation.core';
import {LanguageName} from '../../language/language-name';
import {PreviousText, NextText, ShowingText, ShowingOfText, ShowingToText, EntriesText} from '../../language/page-navigation';
import {SessionService} from '../../services/session.service';
@Component({
  selector: 'app-page-navigation',
  templateUrl: 'page-navigation.component.html',
  styleUrls: ['page-navigation.css']
})
@Injectable()
export class PageNavigationComponent implements OnInit {
  @Output() pageEvent: any;
  @Input() pageSize: number;
  @Input() isMobile: false;
  public selectedPage = 20;
  public pageSizes = [10, 20, 30, 50, 100, 200];
  public currentPageNumber: number;
  public totalPages: number;
  public totalRows: number;
  public itemNumberBegin: number;
  public itemNumberEnd: number;
  public disablePreviousPageButton: boolean;
  public disableNumberPagePrevious: boolean;
  public disableNumberPageNext: boolean;
  public disableFirstPageButton: boolean;
  public disableNextPageButton: boolean;
  public disableLastPageButton: boolean;
  public pageLinks = [];
  public QuantityDisplayPages: number = 2;
  public startPageNumber: number = 1;
  public endPageNumber: number = 3;
  public previousText: LanguageName = PreviousText;
  public nextText: LanguageName = NextText;
  public showingText: LanguageName = ShowingText;
  public showingToText: LanguageName = ShowingToText;
  public showingOfText: LanguageName = ShowingOfText;
  public entriesTextText: LanguageName = EntriesText;
  constructor(public el: ElementRef,
              public sessionService: SessionService,
              public renderer: Renderer2) {
    this.disableNextPageButton = false;
    this.disableLastPageButton = true;
    this.disableFirstPageButton = true;
    this.disablePreviousPageButton = false;
    this.disableNumberPagePrevious = true;
    this.disableNumberPageNext = true;
    this.pageEvent = new EventEmitter();
  }
  ngOnInit() {
    this.selectedPage = this.pageSize;
  }
  public PageLinksBind(startPage: number, endPage: number) {
    this.pageLinks = [];
    for (let i = startPage; i < endPage + 1; i++) {
      this.pageLinks.push(i);
    }

  }
  public databind(transactionalInformation: any): boolean {
    this.currentPageNumber = transactionalInformation.currentPageNumber;
    this.totalPages = transactionalInformation.totalPages;
    this.totalRows = transactionalInformation.totalRows;

    this.itemNumberBegin = ((this.currentPageNumber - 1) * this.pageSize) + 1;
    this.itemNumberEnd = this.currentPageNumber * this.pageSize;
    if (this.itemNumberEnd > this.totalRows) {
      this.itemNumberEnd = this.totalRows;
    }
    this.disableNextPageButton = false;
    this.disableLastPageButton = false;
    this.disableFirstPageButton = false;
    this.disablePreviousPageButton = false;
    if (this.totalPages === 0) {
      this.disableNextPageButton = true;
      this.disableLastPageButton = true;
      this.disableFirstPageButton = true;
      this.disablePreviousPageButton = true;
    }
    if (this.currentPageNumber === 1) {
      this.disableFirstPageButton = true;
      this.disablePreviousPageButton = true;
    }

    if (this.currentPageNumber === this.totalPages) {
      this.disableNextPageButton = true;
      this.disableLastPageButton = true;
    }
    this.displayPages();
    // this.totalRows = transactionalInformation.totalRows;
    // console.log(transactionalInformation);
    return true;
  }
  public displayPages() {
    this.startPageNumber = 1;
    this.endPageNumber = 1;
    const QuantityDisplayPagesStart = this.QuantityDisplayPages + 1;
    const grNumStr: number = (this.currentPageNumber / QuantityDisplayPagesStart);
    const grNum: number = Math.floor(grNumStr);


    if (grNum > 0) {
      this.startPageNumber = (QuantityDisplayPagesStart * grNum);
      this.endPageNumber = (QuantityDisplayPagesStart * grNum) + QuantityDisplayPagesStart;
    } else {
      this.startPageNumber = grNum + 1;
      this.endPageNumber = (grNum + QuantityDisplayPagesStart);
    }

    if (this.totalPages < this.endPageNumber) {
      this.endPageNumber = this.totalPages;
    }
    this.disableNumberPage();
    this.PageLinksBind(this.startPageNumber, this.endPageNumber);

  }

  private disableNumberPage() {
    if (this.endPageNumber === this.totalPages) {
      this.disableNumberPageNext = true;
    } else {
      this.disableNumberPageNext = false;
    }

    if (this.startPageNumber === 1) {
      this.disableNumberPagePrevious = true;
    } else {
      this.disableNumberPagePrevious = false;
    }
  }

  public pageSizeChanged(newPageSize: any) {
    this.currentPageNumber = 1;
    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PageSizeChanged;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    this.pageSize = parseInt(newPageSize) + 0;
    eventInformation.PageSize = this.pageSize;
    // console.log(this.pageSize);
    this.pageEvent.emit({
      value: eventInformation
    });
  }
  public buttonFirstPage() {
    this.currentPageNumber = 1;

    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PagingEvent;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    this.pageEvent.emit({
      value: eventInformation
    });
  }
  public buttonPreviousPage() {
    this.currentPageNumber = this.currentPageNumber - 1;

    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PagingEvent;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    this.pageEvent.emit({
      value: eventInformation
    });
  }
  public buttonNextPage() {
    this.currentPageNumber = this.currentPageNumber + 1;
    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PagingEvent;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    this.pageEvent.emit({
      value: eventInformation
    });
  }

  public NumberPageNext() {
    if (this.totalPages > this.endPageNumber) {

      this.startPageNumber = this.startPageNumber + this.QuantityDisplayPages;

      if (this.startPageNumber > this.totalPages) {
        this.startPageNumber = this.totalPages;
      }

      this.endPageNumber = this.startPageNumber + this.QuantityDisplayPages;

      if (this.endPageNumber > this.totalPages) {
        this.endPageNumber = this.totalPages;
      }

      this.disableNumberPage();
      this.PageLinksBind(this.startPageNumber, this.endPageNumber);
    }

  }
  public NumberPagePrevious() {
    if (this.startPageNumber !== 1) {
      this.startPageNumber = this.startPageNumber - this.QuantityDisplayPages;
      if (this.startPageNumber < 1) {
        this.startPageNumber = 1;
      }

      this.endPageNumber = this.startPageNumber + this.QuantityDisplayPages;
      if (this.endPageNumber > this.totalPages) {
        this.endPageNumber = this.totalPages;
      }

      this.disableNumberPage();
      this.PageLinksBind(this.startPageNumber, this.endPageNumber);

    }

  }
  public buttonLastPage() {
    this.currentPageNumber = this.totalPages;
    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PagingEvent;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    this.pageEvent.emit({
      value: eventInformation
    });

  }

  public buttonNumberPage(numberPage: number) {
    this.currentPageNumber = numberPage;
    const eventInformation = new DataPageEventInformation();
    eventInformation.EventType = PageEventType.PagingEvent;
    eventInformation.CurrentPageNumber = this.currentPageNumber;
    eventInformation.PageSize = this.pageSize;
    // console.log(this.currentPageNumber);
    this.pageEvent.emit({
      value: eventInformation
    });
  }

}
