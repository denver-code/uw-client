import {Injectable} from '@angular/core';


@Injectable()
export class Utilities {

  public static getQueryParamsFromString(paramString: string) {

    if (!paramString) {
      return null;
    }
    const params: { [key: string]: string } = {};

    for (const param of paramString.split('&')) {
      const keyValue = Utilities.splitInTwo(param, '=');
      params[keyValue.firstPart] = keyValue.secondPart;
    }

    return params;
  }


  public static splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
    const separatorIndex = text.indexOf(separator);

    if (separatorIndex === -1) {
      return {firstPart: text, secondPart: null};
    }
    const part1 = text.substr(0, separatorIndex).trim();
    const part2 = text.substr(separatorIndex + 1).trim();

    return {firstPart: part1, secondPart: part2};
  }


}
