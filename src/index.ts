import * as express from "express";
import {createProxyMiddleware, responseInterceptor,} from "http-proxy-middleware";
import {ClientRequest, IncomingMessage, ServerResponse} from "http";
import bodyParser = require("body-parser");
import ResponseConverter from "./ResponseConverter";
import TransactionResultModifier from "./TransactionResultModifier";
import TransactionReceiptResultModifier from "./TransactionReceiptResultModifier";
import BlockResultModifier from "./BlockResultModifier";

const app = express();
const requestMap = new Map<number, string>();

const responseConverter = new ResponseConverter([
  new TransactionResultModifier(),
  new TransactionReceiptResultModifier(),
  new BlockResultModifier(),
])

const apiProxy = createProxyMiddleware({
  target: "https://kaikas.baobab.klaytn.net:8651",
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyReq: function (proxyReq: ClientRequest, req: IncomingMessage, res) {
    if (proxyReq.method !== "POST") {
      return;
    }
    const requestBody = [];
    req
      .on("data", (chunk) => {
        requestBody.push(chunk);
      })
      .on("end", () => {
        console.log("************ HTTP Request ************");
        console.log("Method: %s", req.method);
        const bodyString = Buffer.concat(requestBody).toString();
        console.log("Request: %s", bodyString);
        try {
          const bodyJSON = JSON.parse(bodyString);
          requestMap.set(bodyJSON.id, bodyJSON.method);
        } catch(e) {
          console.warn("Failed to handle request=%s: %s", bodyString, e);
        }
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
        requestMap.delete(responseJSON.id);
        console.log("method: %s", method);
        const ethCompatibleResponse = JSON.stringify(responseConverter.convert(method, responseJSON))
        console.log("response: %s", ethCompatibleResponse);
        return ethCompatibleResponse;
      }
      return buffer;
    }
  ),
  logLevel: "info",
});

app.use(apiProxy);
app.use(bodyParser.json());
app.listen(8651);
