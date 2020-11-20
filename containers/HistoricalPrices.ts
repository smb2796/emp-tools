import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";

import { getHistoricalPrices } from "../utils/getHistoricalPrices";

import Token from "./Token";

function useHistoricalPrices() {
  const { symbol: tokenSymbol } = Token.useContainer();

  //   const [latestPrice, setLatestPrice] = useState<number | null>(null);
  const [gasHistory, setGasHistory] = useState<any | null>(null);
  const [twapHistory, setTwapHistory] = useState<any | null>(null);
  //   const [source, setSource] = useState<string[] | undefined>(undefined);

  const queryGasPrice = async () => {
    setGasHistory(null);

    if (tokenSymbol) {
      const gasQuery = await getHistoricalPrices(tokenSymbol, "gas");
      setGasHistory(gasQuery);
      //   console.log(
      //     `pricefeedparams: ${getPricefeedParamsFromTokenSymbol(tokenSymbol)}`
      //   );
      //   setSource(getPricefeedParamsFromTokenSymbol(tokenSymbol)?.source);
    }
  };
  const queryTwapPrice = async () => {
    setTwapHistory(null);

    if (tokenSymbol) {
      const twapQuery = await getHistoricalPrices(tokenSymbol, "twap");
      setTwapHistory(twapQuery);
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
