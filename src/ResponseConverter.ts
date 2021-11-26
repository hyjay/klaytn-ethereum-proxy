import ResultModifier from "./ResultModifier";

export default class ResponseConverter {

  private resultModifiers: Map<string, ResultModifier> = new Map();

  constructor(resultModifiers: Array<ResultModifier>) {
    resultModifiers.forEach(rc => this.resultModifiers[rc.method()] = rc);
  }

  convert(method: string, originalResponse: JSON): JSON {
    const newResponse = this.copy(originalResponse);
    const rm = this.resultModifiers[method];
    if (!rm) {
      return newResponse;
    }
    rm.modify(newResponse["result"]);
    return newResponse;
  }

  private copy(originalResponse: JSON) {
    return JSON.parse(JSON.stringify(originalResponse));
  }
}
