import ResponseConverter from "../src/ResponseConverter";
import ResponseModifier from "../src/ResponseModifier";

class FakeResponseModifier implements ResponseModifier {
  modify(response: JSON): void {
    response["foo"] = "bar";
  }

  method(): string {
    return "eth_getBlockByNumber";
  }
}

describe('ResponseConverter', function () {
  it('should convert an original response to an ethereum-compatible response delegating to a response modifier', function () {
    const aggregator = new ResponseConverter([new FakeResponseModifier()]);
    const result = aggregator.convert("eth_getBlockByNumber", JSON.parse('{}'));
    expect(result).toStrictEqual(JSON.parse('{"foo":"bar"}'))
  });
});