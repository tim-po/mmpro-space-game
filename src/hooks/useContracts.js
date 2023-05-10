import Web3 from "web3";
import {useWeb3React} from "@web3-react/core";

import {
    getAllocationMarketplaceAddress,
    getBUSDAddress,
    getMMProAddress,
    getPancakeRouterAddress,
} from "../utils/getAddress";

import MMPRO from "../contracts/MMPRO.json";
import BUSD from "../contracts/Busd.json";
import AllocationMarketplace from "../contracts/AllocationMarketplace.json";
import PancakeRouter from "../contracts/PancakeRouter.json"
import getRpcUrl from "../utils/getRpcUrl";
import {useMemo} from "react";

const RPC_URL = getRpcUrl();
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
    timeout: 10000,
});

export const useWeb3 = () => {
    const {library} = useWeb3React();
    return useMemo(() => {
        if (library) {
            return new Web3(library.currentProvider || httpProvider);
        } else {
            return new Web3(httpProvider);
        }
    }, [library]);
};

const useContract = (abi, address) => {
    const web3 = useWeb3();
    return useMemo(() => new web3.eth.Contract(abi, address), [web3, abi, address]);
};

export const useBUSDContract = () => {
    const abi = useMemo(() => BUSD.abi, []);
    return useContract(abi, getBUSDAddress());
};

export const useMMProContract = () => {
    const abi = useMemo(() => MMPRO.abi, []);
    return useContract(abi, getMMProAddress());
};

export const useAllocationMarketplaceContract = () => {
    const abi = useMemo(() => AllocationMarketplace.abi, []);
    return useContract(abi, getAllocationMarketplaceAddress());
};

export const usePancakeRouterContract = () => {
    const abi = useMemo(() => PancakeRouter.abi, []);
    return useContract(abi, getPancakeRouterAddress());
}
