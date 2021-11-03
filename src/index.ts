import * as express from "express";
import {createProxyMiddleware, responseInterceptor,} from "http-proxy-middleware";
import {ClientRequest, IncomingMessage, ServerResponse} from "http";
import bodyParser = require("body-parser");

const app = express();
const requestMap = new Map<number, string>();

const apiProxy = createProxyMiddleware({
  target: "https://kaikas.baobab.klaytn.net:8651",
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyReq: function (proxyReq: ClientRequest, req: IncomingMessage, res) {
    let requestBody = [];
    req
      .on("data", (chunk) => {
        requestBody.push(chunk);
      })
      .on("end", () => {
        console.log("************ HTTP Request ************");
        console.log("Method: %s", req.method);
        console.log("Path: %s", req.url);
        console.log("Headers: %s", req.headers);
        const bodyString = Buffer.concat(requestBody).toString();
        console.log("requestBody %s", bodyString);
        const bodyJSON = JSON.parse(bodyString);
        requestMap.set(bodyJSON.id, bodyJSON.method);
        requestMap.forEach((value, key) => {
          console.log(key, value);
        });
      });
  },
  onProxyRes: responseInterceptor(
    async (
      buffer: Buffer,
      proxyRes: IncomingMessage,
      req: IncomingMessage,
      res: ServerResponse
    ) => {
      if (proxyRes.headers["content-type"] === "application/json") {
        console.log("************ HTTP Response ************");
        const responseJSON = JSON.parse(buffer.toString("utf8"));
        const method = requestMap.get(responseJSON.id);
        console.log("id: %s", responseJSON.id);
        console.log("method: %s", method);

        // klaytn converter
        if (method === "eth_getTransactionReceipt") {
          const { jsonrpc, id, result } = responseJSON;
          if (result != null) {
            console.log("jsonrpc: %s", jsonrpc);
            console.log(result);
            const { type, ...others } = result;
            const newResult = {
              ...others,
              type: "0x0",
              cumulativeGasUsed: "0x0",
            };
            const newResponse = { jsonrpc, id, result: newResult };
            console.log(JSON.stringify(newResponse));
            return JSON.stringify(newResponse);
          }
        } else if (method === "eth_getTransactionByHash") {
          const { jsonrpc, id, result } = responseJSON;
          if (result != null) {
            console.log("jsonrpc: %s", jsonrpc);
            console.log(result);
            const { type, ...others } = result;
            const newResult = {
              ...others,
              type: "0x0",
            };
            const newResponse = { jsonrpc, id, result: newResult };
            console.log(JSON.stringify(newResponse));
            return JSON.stringify(newResponse);
          }
        }

        return JSON.stringify(responseJSON);
      }

      return buffer;
    }
  ),
  logLevel: "debug",
});

app.use(apiProxy);
app.use(bodyParser.json());
app.listen(8651);
