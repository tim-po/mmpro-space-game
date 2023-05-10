import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import {
  getBUSDAddress,
  getMMProAddress, getPancakeRouterAddress,
} from "../utils/getCommonAdress";
import MMPRO from "../contracts/MMPRO.json";
import BUSD from "../contracts/Busd.json";
import PancakeRouter from '../contracts/PancakeRouter.json'
import getRpcUrl from "../utils/getRpcUrl";

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000,
});

export const useWeb3 = () => {
  const { library } = useWeb3React();
  let web3;
  if (library) {
    web3 = new Web3(library.currentProvider || httpProvider);
  } else {
    web3 = new Web3(httpProvider);
  }
  return web3;
};

export const useContract = (abi, address) => {
  const web3 = useWeb3();
  return new web3.eth.Contract(abi, address);
};

export const useBUSDContract = () => {
  const abi = BUSD.abi;
  return useContract(abi, getBUSDAddress());
};

export const useMMProContract = () => {
  const abi = MMPRO.abi;
  return useContract(abi, getMMProAddress());
};

export const usePancakeRouterContract = () => {
  const abi = PancakeRouter.abi;
  return useContract(abi, getPancakeRouterAddress());
}
