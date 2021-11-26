import ResponseConverter from "../src/ResponseConverter";
import BlockResultModifier from "../src/BlockResultModifier";

describe('BlockResultModifier', function () {
  it('should modify block result to be compatible with ethers.js', function () {
    const modifier = new BlockResultModifier()
    const result = JSON.parse(' {\n' +
      ' \t"jsonrpc": "2.0",\n' +
      ' \t"id": 45,\n' +
      ' \t"result": {\n' +
      ' \t\t"blockscore": "0x1",\n' +
      ' \t\t"extraData": "0xd883010701846b6c617988676f312e31352e37856c696e757800000000000000f90164f85494571e53df607be97431a5bbefca1dffe5aef56f4d945cb1a7dccbd0dc446e3640898ede8820368554c89499fb17d324fa0e07f23b49d09028ac0919414db694b74ff9dea397fe9e231df545eb53fe2adf776cb2b841414fc25ad2abac8e4b0b18b50a3f5366ba6929e276221161c6326ddadde87478608104a88877393ec1766a67b64fed0801e2d687af8bd5323c451c5a9479b83c00f8c9b8411fe251546e9be73e3fc74b98f3e136e99ef4e34c1d9770d03419202e48736c63164dd5d6fa79c6272294f41d9c33c6d900d28fd2a624e013536ff400ab16a47e01b841aae394a0b6e273d81c29084c63d2b61fc80387c7b8996ae55e1febd0f5a68ad60928cd372822bda93982f835283f17d8384f9c5d99dbaa4a31e1836e44dd7c8a01b8418437668404107b178a165024fa1ee43e0e7ae189429ffa5d87cdb9906fa0cc14069c1c5d39621c9aac9b2b178050ecc336cb8bbb0d604e5528aeed20dd13df1500",\n' +
      ' \t\t"gasUsed": "0x0",\n' +
      ' \t\t"governanceData": "0x",\n' +
      ' \t\t"hash": "0xc9bd819fceada2b3b397be20c7b70b681e016dbf3e04abfe135aa9607a74adca",\n' +
      ' \t\t"logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",\n' +
      ' \t\t"number": "0x48cb078",\n' +
      ' \t\t"parentHash": "0xe6bc94c942fadb1be86e0fb516f5eb9e2c221698c32c026f9041175c7ee48dae",\n' +
      ' \t\t"receiptsRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",\n' +
      ' \t\t"reward": "0x6559a7b6248b342bc11fbcdf9343212bbc347edc",\n' +
      ' \t\t"size": "0x33c",\n' +
      ' \t\t"stateRoot": "0xb88b3695bdeb7e69393c0328a6f0d1c345b4de425e8df2c79da27dd9cd0ff6b8",\n' +
      ' \t\t"timestamp": "0x61a05141",\n' +
      ' \t\t"timestampFoS": "0x0",\n' +
      ' \t\t"totalBlockScore": "0x48cb079",\n' +
      ' \t\t"transactions": [],\n' +
      ' \t\t"transactionsRoot": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",\n' +
      ' \t\t"voteData": "0x"\n' +
      ' \t}\n' +
      ' }');
    modifier.modify(result)
    expect(result["nonce"]).toStrictEqual("0x0")
    expect(result["difficulty"]).toStrictEqual("0x0")
    expect(result["gasLimit"]).toStrictEqual("0x0")
    expect(result["miner"]).toStrictEqual("0xbb7b8287f3f0a933474a79eae42cbca977791171")
  });
});
