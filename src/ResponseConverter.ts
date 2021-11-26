import ResponseModifier from "./ResponseModifier";

export default class ResponseConverter {

  private responseModifiers: Map<string, ResponseModifier> = new Map();

  constructor(responseModifiers: [ResponseModifier]) {
    responseModifiers.forEach(rc => this.responseModifiers[rc.method()] = rc);
  }

  convert(method: string, originalResponse: JSON): JSON {
    const rm = this.responseModifiers[method];
    if (!rm) {
      throw Error("No matching response modifier for the method.");
    }
    const result = this.copy(originalResponse);
    rm.modify(result);
    return result;
  }

  private copy(originalResponse: JSON) {
    return JSON.parse(JSON.stringify(originalResponse));
  }
}
