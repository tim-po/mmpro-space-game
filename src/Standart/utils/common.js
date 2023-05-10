/* eslint-disable no-undef */
import {BigNumber} from "bignumber.js";

export const wei2eth = (val) => {
  if (val) {
    return new BigNumber(val) / new BigNumber(1000000000000000000);
  }
  return new BigNumber(0);
};
