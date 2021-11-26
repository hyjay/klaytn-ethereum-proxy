import ResultModifier from "./ResultModifier";

export default class TransactionReceiptResultModifier implements ResultModifier {
  method(): string {
    return "eth_getTransactionReceipt";
  }

  modify(result: JSON): void {
    result["type"] = "0x0";
    result["cumulativeGasUsed"] = "0x0";
  }
}
