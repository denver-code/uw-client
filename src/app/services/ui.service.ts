import {Injectable} from '@angular/core';
import {Global} from '../Shared/global';
import {SessionService} from '../services/session.service';

@Injectable()
export class UiService {

  // private messageBox = "";

  constructor(private sessionService: SessionService) {

  }

  // DownloadFile(url: string) {
  //   this.openLink(url, "");
  //
  // }
  //
  // ViewFile(url: string) {
  //   this.openLink(url, "_blank");
  //
  // }
  //
  // ShowInNewTab(url: string) {
  //   this.openLink(url, "_blank");
  //
  // }
  //
  // ShowInSelf(url: string) {
  //   this.openLink(url, "_self");
  //
  // }

  // ViewFileIframe(elemId: string, url: string) {
  //   let doc = document.getElementById(elemId);
  //   doc.setAttribute("src", url);
  // }
  //
  // private openLink(url: string, target: string) {
  //   var link = document.createElement("a");
  //   if (link.download !== undefined) {
  //     link.setAttribute("href", url);
  //     if (target !== "")
  //       link.target = target;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // }

  LoadingStart() {
    const loading = document.getElementById('indLoading');
    loading.style.display = 'block';
    const w = window.innerWidth;
    const h = window.innerHeight;
    loading.style.height = h + 'px';
    loading.style.width = w + 'px';
  }

  LoadingEnd() {
    const loading = document.getElementById('indLoading');
    loading.style.display = 'none';
  }

  // NavbarComponentStart() {
  //   let container = document.getElementById('container');
  //   let NavbarComponent = document.getElementById("navbarComponent");
  //   if (container.className == "bm_sidebar_open") {
  //     if (NavbarComponent) {
  //       NavbarComponent.style.left = "320px";
  //     }
  //   }
  //   else {
  //     if (NavbarComponent) {
  //       NavbarComponent.style.left = "120px";
  //     }
  //   }
  //
  // }

}
