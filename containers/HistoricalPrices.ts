import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";

import { getHistoricalPrices } from "../utils/getHistoricalPrices";

import Token from "./Token";

function useHistoricalPrices() {
  const { symbol: tokenSymbol } = Token.useContainer();

  //   const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [gasHistory, setGasHistory] = useState<Object | null>(null);
  const [twapHistory, setTwapHistory] = useState<Object | null>(null);
  //   const [source, setSource] = useState<string[] | undefined>(undefined);

  const queryGasPrice = async () => {
    setGasHistory(null);

    //LOG OUT HERE
    console.log(`tokenSymbol: ${tokenSymbol}`);
    if (tokenSymbol) {
      console.log(`tokenSymbol: ${tokenSymbol}`);
      const gasQuery = await getHistoricalPrices(tokenSymbol, "gas");
      console.log(`gasquery: ${gasQuery}`);
      setGasHistory(gasQuery);
      console.log(`gasHistory: ${gasHistory}`);
      //   console.log(
      //     `pricefeedparams: ${getPricefeedParamsFromTokenSymbol(tokenSymbol)}`
      //   );
      //   setSource(getPricefeedParamsFromTokenSymbol(tokenSymbol)?.source);
    }
  };
  const queryTwapPrice = async () => {
    setTwapHistory(null);

    //LOG OUT HERE
    console.log(`tokenSymbol: ${tokenSymbol}`);
    if (tokenSymbol) {
      const twapQuery = await getHistoricalPrices(tokenSymbol, "twap");
      console.log(`twapQuery: ${twapQuery}`);
      setTwapHistory(twapQuery);
      console.log(`twapHistory: ${twapHistory}`);
      //   console.log(
      //     `pricefeedparams: ${getPricefeedParamsFromTokenSymbol(tokenSymbol)}`
      //   );
      //   setSource(getPricefeedParamsFromTokenSymbol(tokenSymbol)?.source);
    }
  };

  // update price on setting of contract
  useEffect(() => {
    queryGasPrice();
    queryTwapPrice();
  }, [tokenSymbol]);

  return {
    gasHistory,
    twapHistory,
  };
}

const HistoricalPrices = createContainer(useHistoricalPrices);

export default HistoricalPrices;
