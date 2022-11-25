import express, { Request, Response } from "express";
import fetch from "node-fetch";

export const utils = express.Router();

utils.get("/price/:symbol", async function (req: Request, res: Response) {
  const { symbol } = req.params;

  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&CMC_PRO_API_KEY=${process.env.CMC_API_KEY}&convert=USD`
  );

  const data: any = await response.json();

  const price = data.data[symbol].quote["USD"].price;

  res.send({ price: price });
});
