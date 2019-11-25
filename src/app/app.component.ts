import { Component, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-my-library';
  frozenCols: any = [
    {
      header: 'Index', field: 'index'
    },
    {
      header: 'surname', field: 'surname'
    },
    {
      header: 'middleName', field: 'middleName'
    },
  ];
  scrollCols: any = [
    {
      header: 'Surname1', field: 'surname1'
    },
    {
      header: 'Surname2', field: 'surname2'
    },
    {
      header: 'Surname3', field: 'surname3'
    },
    {
      header: 'Surname1', field: 'surname1'
    },
    {
      header: 'Surname2', field: 'surname2'
    },
  ]
  rows: any = [];
  loading: boolean = false;
  virtualRows: any = [];
  totalRecords: number;
  @ViewChild("scroll", { static: false }) scroll: CdkVirtualScrollViewport;
  @ViewChild("frozen", { static: false }) frozen: CdkVirtualScrollViewport;
  @ViewChild("scroll", { static: false }) scrollTemplate: CdkVirtualScrollViewport;
  frozenItems: any = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.rows = Array.from({ length: 4221 }).map((_, i) => {
      return {
        index: `Item #${i}`,
        surname: 'harshad',
        middleName: 'maniyar',
        surname1: 'maniyars',
        surname2: 'maniyard',
        surname3: 'maniyars'
      }
    });
    console.log(this.rows);
    this.totalRecords = this.rows.length;
    this.createFrozenItems();
  }
  scrollItems = [];
  createFrozenItems() {
    for (let index = 0; index < this.rows.length; index++) {
      const rowObj = this.rows[index];
      const frozenRowObj = {};
      const scrollItem = {};
      this.frozenCols.forEach((frozenColObj) => {
        frozenRowObj[frozenColObj.field] = rowObj[frozenColObj.field];
      });
      this.scrollCols.forEach((scrollColObj) => {
        scrollItem[scrollColObj.field] = rowObj[scrollColObj.field];
      });
      scrollItem["surname1"] += ` ${index}`;
      // frozenRowObj["surname"] += ` ${index}`;
      this.scrollItems.push(scrollItem);
      this.frozenItems.push(frozenRowObj);
    }
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.scroll.elementScrolled().subscribe((event) => {
    //   console.log("elementScrolled");
    //   this.frozen.elementRef.nativeElement.scrollTop = this.scroll.elementRef.nativeElement.scrollTop;
    // });
    this.scroll.elementRef.nativeElement.addEventListener('scroll', this.bodyScrollListener);
    this.frozen.elementRef.nativeElement.addEventListener('scroll', this.frozenBodyScrollListener);
  }
  frozenBodyScrollListener = (event) => {
    console.log("frozenBodyScrollListener");
    this.scroll.elementRef.nativeElement.scrollTop = this.frozen.elementRef.nativeElement.scrollTop;
  }
  bodyScrollListener = (event) => {
    console.log("bodyScrollListener");
    this.frozen.elementRef.nativeElement.scrollTop = this.scroll.elementRef.nativeElement.scrollTop;
  }
  loadDataOnScroll(event: LazyLoadEvent) {
    this.loading = true;
    debugger
    //for demo purposes keep loading the same dataset 
    //in a real production application, this data should come from server by building the query with LazyLoadEvent options 
    setTimeout(() => {
      //last chunk
      if (event.first === 249980)
        this.virtualRows = this.loadChunk(event.first, 20);
      else
        this.virtualRows = this.loadChunk(event.first, event.rows);

      this.loading = false;
    }, 250);
  }

  loadChunk(index, length) {
    let chunk = [];
    for (let i = 0; i < length; i++) {
      if (!this.rows[i + index]) {
        break;
      }
      chunk[i] = { ...this.rows[i + index] };
    }
    return chunk;
  }
}
