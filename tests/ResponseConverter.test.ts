import ResponseConverter from "../src/ResponseConverter";
import ResultModifier from "../src/ResultModifier";

class FakeResultModifier implements ResultModifier {
  modify(result: JSON): void {
    result["foo"] = "bar";
  }

  method(): string {
    return "eth_getBlockByNumber";
  }
}

describe('ResponseConverter', function () {
  it('should convert an original response to an ethereum-compatible response delegating to a response modifier', function () {
    const aggregator = new ResponseConverter([new FakeResultModifier()]);
    const result = aggregator.convert("eth_getBlockByNumber", JSON.parse('{"jsonrpc":"2.0","id":45,"result":{}}'));
    expect(result).toStrictEqual(JSON.parse('{"jsonrpc":"2.0","id":45,"result":{"foo":"bar"}}'))
  });
});
