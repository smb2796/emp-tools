import { useState, MouseEvent } from "react";
import { Box, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import styled from "styled-components";

import HistoricalTwapPricesGraph from "./HistoricalTwapPricesGraph";
import HistoricalGasPricesGraph from "./HistoricalGasPricesGraph";

import Connection from "../../containers/Connection";
import Token from "../../containers/Token";

import { GAS_TOKENS } from "../../constants/gasTokens";

const OutlinedContainer = styled.div`
  padding: 1rem;
  border: 1px solid #434343;
`;

const GasAnalytics = () => {
  const { address: tokenAddress } = Token.useContainer();
  const { network } = Connection.useContainer();

  const isGasToken =
    tokenAddress &&
    Object.keys(GAS_TOKENS).includes(tokenAddress.toLowerCase());

  const [dialogTabIndex, setDialogTabIndex] = useState<string>(
    "gas-twohour-analytics"
  );
  const handleAlignment = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setDialogTabIndex(newAlignment);
  };

  if (network === null || !isGasToken) {
    return (
      <Box py={2}>
        <Typography>
          <i>Please first connect to a network, and then select a gas token.</i>
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box>
        <Box pb={2} pt={0} textAlign="center">
          <ToggleButtonGroup
            value={dialogTabIndex}
            exclusive
            onChange={handleAlignment}
          >
            <ToggleButton value="gas-twohour-analytics">
              2 Hour Token TWAP
            </ToggleButton>
            <ToggleButton value="median-gas-analytics">
              30 Day Median Gas Price
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {dialogTabIndex === "gas-twohour-analytics" && (
          <Box py={2}>
            <OutlinedContainer>
              <HistoricalTwapPricesGraph />
            </OutlinedContainer>
          </Box>
        )}
        {dialogTabIndex === "median-gas-analytics" && (
          <Box py={2}>
            <OutlinedContainer>
              <HistoricalGasPricesGraph />
            </OutlinedContainer>
          </Box>
        )}
      </Box>
    );
  }
};

export default GasAnalytics;
