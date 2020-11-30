interface PricefeedParams {
  invertedPrice: boolean;
  // TODO: This is a really simple mapping of identifier to URL to query to get latest price for an identifier.
  // Future work should blend off-chain prices from different sources similar to how we do it in
  // `protocol/financial-templates-lib/price-feed/MedianizerPriceFeed.js`
  source: string[];
}

interface PricefeedParamsMap {
  [identifier: string]: PricefeedParams;
}

function _getMedianFromJSON(jsonData: any) {
  return jsonData;
}

function _getTwapFromJSON(jsonData: any) {
  return jsonData;
}
// This function returns a type predicate that we can use to filter prices from a (number | null)[] into a number[],
// source: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
function isValidPrice<Price>(value: Price | null): value is Price {
  return value !== null;
}

export const PRICEFEED_PARAMS: PricefeedParamsMap = {
  twap: {
    invertedPrice: false,
    source: ["https://ugasdata.info/twap-range"],
  },
  gas: {
    invertedPrice: false,
    source: ["https://ugasdata.info/median-range"],
  },
};

export function getPricefeedParamsFromTokenSymbol(queryType: string) {
  // This returns whichever "case" expression matches the conditional in `switch`.
  // In this case, whichever "case" expression evaluates to "true".
  // Source: https://stackoverflow.com/questions/4082204/javascript-conditional-switch-statement

  switch (true) {
    case queryType?.includes("gas"):
      return PRICEFEED_PARAMS.gas;
    // case symbol?.includes("uGAS"):
    //   return PRICEFEED_PARAMS.gaseth;
    case queryType?.includes("twap"):
      return PRICEFEED_PARAMS.twap;
    default:
      return null;
  }
}

// Wrapper around `getPricefeedParamsFromTokenSymbol.invertedPrice` so that it never returns null
//   export function isPricefeedInvertedFromTokenSymbol(symbol: string | null) {
//     const pricefeedParams = getPricefeedParamsFromTokenSymbol(symbol);
//     if (pricefeedParams === null) {
//       return false;
//     } else {
//       return pricefeedParams.invertedPrice;
//     }
//   }

export const getHistoricalPrices = async (
  symbol: string,
  queryType: string
) => {
  let identifierParams = getPricefeedParamsFromTokenSymbol(queryType);
  if (identifierParams === null) {
    console.error(
      `Missing identifier parameters for token with symbol ${symbol}`
    );
    return null;
  } else {
    const prices: (any | null)[] = await Promise.all(
      identifierParams.source.map(async (url: string) => {
        try {
          const response = await fetch(url);
          const json = await response.json();

          switch (true) {
            case url.includes("median"):
              return _getMedianFromJSON(json);
            case url.includes("twap"):
              return _getTwapFromJSON(json);
            default:
              return null;
          }
        } catch (err) {
          console.error(
            `Failed to get prices for for token with symbol ${symbol}, url=${url}`,
            err
          );
          return null;
        }
      })
    );

    const validPrices = prices.filter(isValidPrice);

    if (validPrices.length > 0) {
      // Sort in ascending order (lowest first), and return the median index.
      // const mid = Math.floor(validPrices.length / 2);
      // validPrices.sort((a: number, b: number) => a - b);
      // let medianPrice;
      // if (validPrices.length % 2 === 0) {
      //   medianPrice = (validPrices[mid - 1] + validPrices[mid]) / 2;
      // } else {
      //   medianPrice = validPrices[mid];
      // }

      // // Return inverted price if appropriate
      // if (identifierParams.invertedPrice) {
      //   return 1 / medianPrice;
      // } else {
      //   return medianPrice;
      // }
      if (validPrices[0].length > 0) {
        return validPrices[0];
      }
    } else {
      return null;
    }
  }
};
