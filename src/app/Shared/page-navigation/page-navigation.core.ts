export class DataPageEventInformation {
  public EventType: string;
  public PageSize: number;
  public CurrentPageNumber: number;
  public CheckBoxChecked: boolean;
}
export class PageEventType {
  public static PageSizeChanged = 'PageSizeChanged';
  public static PagingEvent = 'PagingEvent';
}
