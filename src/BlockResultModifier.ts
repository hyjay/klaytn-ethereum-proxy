import ResultModifier from "./ResultModifier";

export default class BlockResultModifier implements ResultModifier {
  method(): string {
    return "eth_getBlockByNumber";
  }

  modify(result: JSON): void {
    result["nonce"] = "0x0"
    result["difficulty"] = "0x0"
    result["gasLimit"] = "0x0"
    result["miner"] = "0xbb7b8287f3f0a933474a79eae42cbca977791171"
  }
}
