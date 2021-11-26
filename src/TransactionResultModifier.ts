import ResultModifier from "./ResultModifier";

export default class TransactionResultModifier implements ResultModifier {
  method(): string {
    return "eth_getTransactionByHash";
  }

  modify(result: JSON): void {
    result["type"] = "0x0"
  }
}
