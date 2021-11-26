import * as express from "express";
import {createProxyMiddleware, responseInterceptor,} from "http-proxy-middleware";
import {ClientRequest, IncomingMessage, ServerResponse} from "http";
import bodyParser = require("body-parser");
import ResponseConverter from "./ResponseConverter";
import TransactionResultModifier from "./TransactionResultModifier";
import TransactionReceiptResultModifier from "./TransactionReceiptResultModifier";

const app = express();
const requestMap = new Map<number, string>();

const responseConverter = new ResponseConverter([
  new TransactionResultModifier(),
  new TransactionReceiptResultModifier(),
])

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
        try {
          console.log("requestBody %s", bodyString);
          const bodyJSON = JSON.parse(bodyString);
          requestMap.set(bodyJSON.id, bodyJSON.method);
          requestMap.forEach((value, key) => {
            console.log(key, value);
          });
        } catch {
          console.log("Failed to handle request=%s", bodyString);
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

        const ethCompatibleResponse = responseConverter.convert(method, responseJSON)
        return JSON.stringify(ethCompatibleResponse);
      }
      return buffer;
    }
  ),
  logLevel: "debug",
});

app.use(apiProxy);
app.use(bodyParser.json());
app.listen(8651);
