import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServerService} from '../services/server.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {WriteReviewComponent} from './write-review.component';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {SessionService} from '../services/session.service';
import {MessagesComponent} from '../Shared/messages/messages.component';
import {PageNavigationComponent} from '../Shared/page-navigation/page-navigation.component';
import {TransactionalInformation} from '../entities/TransactionalInformation.entity';
import {DataPageEventInformation, PageEventType} from '../Shared/page-navigation/page-navigation.core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import {Guid} from '../model/CreateGuid';
import * as _moment from 'moment';
import {ReviewsColumn} from '../model/ReviewsColumn';
import {SaveText, CloseText, RateText} from '../language/general-language';
import {LanguageName} from '../language/language-name';
import {WriteReviewText, UserReviewsText, MoreText, ReplyText, InsertText, LeavingFeedbackText} from '../language/reviews-tree';
import {ChatColumn} from '../model/ChatColumn';
const moment =  _moment;
export class FileNode {
  name: string;
  children?: FoodNode[];
  type: any;
}


interface FoodNode {
  name: string;
  rating?: number;
  description?: string;
  firstname?: string;
  surname?: string;
  createdAt?: string;
  children?: FoodNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  rating: number;
  level: number;
}



@Component({
  selector: 'app-tree-reviews',
  templateUrl: './tree-reviews.component.html',
  styleUrls: ['./tree-reviews.component.css']
})
export class TreeReviewsComponent implements OnInit {
  @Input() chatId: number;
  public chat: ChatColumn;
  public saveText: LanguageName = SaveText;
  public closeText: LanguageName = CloseText;
  public writeReviewText: LanguageName = WriteReviewText;
  public userReviewsTextText: LanguageName = UserReviewsText;
  public moreText: LanguageName = MoreText;
  public replyText: LanguageName = ReplyText;
  public insertText: LanguageName = InsertText;
  public leavingFeedbackText: LanguageName = LeavingFeedbackText;
  public rateText: LanguageName = RateText;
  currentRate = 0;
  readonly = true;
  public  TREE_DATA: FoodNode[] = [];
  public saveNode: ExampleFlatNode[] = [] ;
  // Mobile
  public isMobile: boolean;
  deviceInfo = null;
  // Page
  @ViewChild (PageNavigationComponent, {static: true}) pageNavigation: PageNavigationComponent;
  // page
  public pageSize: number;
  // Messages
  @ViewChild(MessagesComponent, {static: false}) Messages: MessagesComponent;
  public reviewsList: ReviewsColumn[] = [];
  //
  public searchNode = null;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      description: node.description,
      rating: node.rating,
      firstname: node.firstname,
      surname: node.surname,
      createdAt: node.createdAt,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  constructor(public service: ServerService,
              public sessionService: SessionService,
              public deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              public router: Router,
              public fb: FormBuilder) {
    this.pageSize = 10;
    this.isMobile = false;
    this.epicFunction();
    this.dataSource.data = this.TREE_DATA;
    // this.treeControl.expandAll();
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit() {
      this.StartPage();
  }
  StartPage() {
    // console.log(this.chatId);
    if ( this.chatId !== -1){
      this.StartGetService();
    }
    else{
      this.StartProvide();
    }
  }
  StartProvide(){
    this.service.httpPost(`reviews_tree/sum`, {}).subscribe(
      data => {
        // Success
        // console.log(data.body.message.round);
        this.currentRate = data.body.message.round;
      },
      error => {
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
    this.LoadData(this.pageSize,1);
  }
  StartGetService() {
    this.service.httpPost(`notification/chat`, {id: this.chatId }).subscribe(
      dataChat => {
        // Success
        this.chat = dataChat.body.message.chat[0];
        // console.log(this.chat);
        // console.log(this.provideId);
        this.service.httpPost(`reviews_tree/sum_service`, {provide: this.chat.provide.id}).subscribe(
          data => {
            // Success
            // console.log(data.body.message.round);
            this.currentRate = data.body.message.round;
          },
          error => {
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
        this.LoadData(this.pageSize,1);
      },
      error => {
        // this.uiService.LoadingEnd();
        this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
        return;
      }
    );
  }
  public LoadData(pageSize: number, currentPageNumber: number) {
    // console.log(this.searchText);
    this.TREE_DATA = [];
    if ( this.chatId !== -1){
      this.service.httpPost(`reviews_tree/root_service`, {provide: this.chat.provide.id,
        page: currentPageNumber , amount: this.pageSize, selector: ''}).subscribe(
        data => {
          // Success
          const transactionalInformation = new TransactionalInformation();
          transactionalInformation.currentPageNumber = currentPageNumber;
          transactionalInformation.pageSize = pageSize;
          transactionalInformation.totalPages = this.service.calculateTotalPages(data.body.message.totalAmount, pageSize );
          transactionalInformation.totalRows = data.body.message.totalAmount;
          this.reviewsList = data.body.message.reviews;
          for (const review of this.reviewsList) {
            const newNode = {
              name: review.name,
              rating: review.rate,
              description: review.description,
              firstname: review.reciever.name,
              surname: review.reciever.surname,
              createdAt: moment(review.createdAt).format('MMM DD YY'),
              children: JSON.parse(review.childJson)
            };
            this.TREE_DATA.push(newNode);
            this.dataSource.data = this.TREE_DATA;
            // console.log(this.reviewsList);
          }
          this.pageNavigation.databind(transactionalInformation);
        },
        error => {
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    }
    else {
      this.service.httpPost(`reviews_tree/root`, {page: currentPageNumber , amount: this.pageSize, selector: ''}).subscribe(
        data => {
          // Success
          const transactionalInformation = new TransactionalInformation();
          transactionalInformation.currentPageNumber = currentPageNumber;
          transactionalInformation.pageSize = pageSize;
          transactionalInformation.totalPages = this.service.calculateTotalPages(data.body.message.totalAmount, pageSize );
          transactionalInformation.totalRows = data.body.message.totalAmount;
          this.reviewsList = data.body.message.reviews;
          for (const review of this.reviewsList) {
            const newNode = {
              name: review.name,
              rating: review.rate,
              description: review.description,
              firstname: review.reciever.name,
              surname: review.reciever.surname,
              createdAt: moment(review.createdAt).format('MMM DD YY'),
              children: JSON.parse(review.childJson)
            };
            this.TREE_DATA.push(newNode);
            this.dataSource.data = this.TREE_DATA;
            // console.log(this.reviewsList);
          }
          this.pageNavigation.databind(transactionalInformation);
        },
        error => {
          this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
          return;
        }
      );
    }
  }
  editNotification(id: number) {
    this.router.navigate(
      ['ViewServiceNotification'],
      {
        queryParams: {
          viewId: id,
          mail: 0
        }
      }
    );
    // this.router.navigate(['ViewNotification']); // AddNotification
    // alert('123'); AddAnnouncement
  }

  public pageEvent(event: any) {
    const pageEvent: DataPageEventInformation = event.value;
    if ( pageEvent.EventType === PageEventType.PageSizeChanged) {
      this.pageSize = pageEvent.PageSize;
    }
    // console.log(pageEvent.CurrentPageNumber);
    this.LoadData(pageEvent.PageSize, pageEvent.CurrentPageNumber);
  }
  /**
   * tree level search
   */
  treeLevelSearch(value: any, level: number, search: string) {
    for (const k in value) {
      const v = value[k];
      const node = new FileNode();
      node.name = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        // levelSearch ++;
        node.children = this.treeLevelSearch(v, level + 1, search);
      } else {
        node.type = v;
      }
      // data.push(node);
      // let aa = level -2;
      if ( v !== null) {
        if ( v !== undefined) {
          if (v.name === search ) {
            this.searchNode = v;
          }
        }
      }
    }
    return this.searchNode; // data;
  }
  treeNodeExpanded(node: any) {
    if (!this.treeControl.isExpanded(node)) {
      // ExampleFlatNode
      const seOld = this.saveNode.find(x => x.name === node.name && x.level === node.level);
      // console.log(seOld);
      if (!seOld) {
        // console.log('Save');
        this.saveNode.push(node);
      }
    }
  }
  addMatTreeNode(node: any) {
    document.getElementById(node.name).style.display = 'block';
    const seOld = this.saveNode.find(x => x.name === node.name && x.level === node.level);
    if (!seOld) {
      this.saveNode.push(node);
    }
    for (const selNode of this.saveNode) {
      const se = this.treeControl.dataNodes.find(x => x.name === selNode.name && x.level === selNode.level);
      this.treeControl.expand(se);
    }
    // console.log(node.name);
  }
  saveMatTreeNode(node: any) {
    // const textAdd = document.getElementById('text' + node.name);
    const textAdd  = (  document.getElementById('text' + node.name) as HTMLInputElement).value;
    if (textAdd !== '' ) {
      // Parse the string to json object.
      const dataObject = this.TREE_DATA;
      // const dataObject = this.dataSource.data;
      // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
      //     file node as children.
      // const data = this.buildFileTree(dataObject, 0);
      this.searchNode = null;
      const data = this.treeLevelSearch(dataObject, 0 , node.name);
      if (!Array.isArray(data.children)) {
        data.children = [];
      }
      const newNode = {
        name: Guid.newGuid(),
        rating: 4,
        description: textAdd,
        firstname: this.sessionService.AuthorizedUser.firstName,
        surname: this.sessionService.AuthorizedUser.lastName === null ? ' ' : this.sessionService.AuthorizedUser.lastName,
        createdAt: moment().format('MMM DD YY'),
        children: []
      };

      // !!! new data.children !!!
      const treeNode = [];
      treeNode.push(newNode);
      for (const selnode of data.children) {
        treeNode.push(selnode);
      }
      data.children = treeNode;
      // data.children.push(newNode);

      // console.log(data);
      this.dataSource.data = this.TREE_DATA;
      const seOld = this.saveNode.find(x => x.name === node.name && x.level === node.level);
      if (!seOld) {
        this.saveNode.push(node);
      }
      for (const selNode of this.saveNode) {
        const se = this.treeControl.dataNodes.find(x => x.name === selNode.name && x.level === selNode.level);
        this.treeControl.expand(se);
      }
      const per = this.treeControl.dataNodes.findIndex(x => x.name === newNode.name);
      if (this.treeControl.dataNodes[per].level > 0) {
        let i = per;
        let startLevel = this.treeControl.dataNodes[per].level;
        let endLevel = this.treeControl.dataNodes[per].level;
        do  {
          i--;
          startLevel = this.treeControl.dataNodes[i].level;
          endLevel = this.treeControl.dataNodes[per].level;
        } while (endLevel === startLevel)
        this.service.httpPost(`reviews_tree/create`, {name: newNode.name , parent: this.treeControl.dataNodes[i].name,
          description: newNode.description , rate: 0, json: JSON.stringify(newNode.children)}).subscribe(
          dataNode => {
            // Success
          },
          error => {
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
        // Update
        let j = per;
        let stLevel = this.treeControl.dataNodes[per].level;
        do  {
          j--;
          stLevel = this.treeControl.dataNodes[j].level;
        } while (stLevel !== 0)
        // console.log(j);
        const dataJson = this.treeLevelSearch(dataObject, 0 , this.treeControl.dataNodes[j].name);
        this.service.httpPost(`reviews_tree/update`, {name: dataJson.name , json: JSON.stringify(dataJson.children)}).subscribe(
          dataRootNode => {
            // Success
          },
          error => {
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
      }
    } else {
      document.getElementById('error' + node.name).style.display = 'block';
    }

  }
  closeMatTreeNode(node: any) {
    (document.getElementById('text' + node.name) as HTMLInputElement).value = '';
    document.getElementById(node.name).style.display = 'none';
    document.getElementById('error' + node.name).style.display = 'none';
  }
  getWriteReview() {
    const dialogRef = this.dialog.open(WriteReviewComponent, {
      width: '450px',
      data: {title: '', content: '', details: this.leavingFeedbackText[this.sessionService.activeLanguage]}
    });
    // If you need a result from your dialog
    dialogRef.afterClosed().subscribe(result => {
      // Do something with result, if needed.
      // console.log(this.sessionService.AuthorizedUser.lastName);
      if (result) {
        // console.log('Yes');
        const newNode = {
          name: Guid.newGuid(),
          rating: this.sessionService.reviewsTreeSelRate,
          description: this.sessionService.reviewsTreeSelDescription,
          firstname: this.sessionService.AuthorizedUser.firstName,
          surname: this.sessionService.AuthorizedUser.lastName === null ? ' ' : this.sessionService.AuthorizedUser.lastName,
          createdAt: moment().format('MMM DD YY'),
          children: []
        };
        // !!! new TREE_DATA !!!
        const treeData = [];
        treeData.push(newNode);
        for (const selnode of this.TREE_DATA) {
          treeData.push(selnode);
        }
        // this.TREE_DATA.push(newNode);
        this.TREE_DATA = treeData;
        // console.log(newNode);
        this.dataSource.data = this.TREE_DATA;
        // const seOld = this.saveNode.find(x => x.name === node.name && x.level === node.level);
        // if (!seOld) {
        //   this.saveNode.push(node);
        // }
        for (const selNode of this.saveNode) {
          const se = this.treeControl.dataNodes.find(x => x.name === selNode.name && x.level === selNode.level);
          this.treeControl.expand(se);
        }
        //
        // this.treeControl.dataNodes
        this.service.httpPost(`reviews_tree/create`, {name: newNode.name , parent: '',
          description: newNode.description , rate: this.sessionService.reviewsTreeSelRate,
          json: JSON.stringify(newNode.children), provide: this.chat.provide.id, chat: this.chatId}).subscribe(
          data => {
            // Success
          },
          error => {
            this.Messages.AddMessage(this.service.globalMessageError(), 'alert-danger');
            return;
          }
        );
        //
      } else {
        console.log('Closed');
      }
    });
    // this.router.navigate(['LeavingFeedback']);
  }
  moreTreeNode(node: any) {
    document.getElementById('more' + node.name).style.whiteSpace = 'normal';
    document.getElementById('morebtn' + node.name).style.display = 'none';
  }
  epicFunction() {
    // console.log('device Service');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(this.isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.
  }

}
