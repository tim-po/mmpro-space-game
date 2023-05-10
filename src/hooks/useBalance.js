import {useCallback, useEffect, useState} from "react";
import {useBUSDContract, useMMProContract} from "./useContracts";
import {useWeb3React} from "@web3-react/core";
export const useBalanceOfToken = (tokenContract) => {

    const {account, active} = useWeb3React();

    const [balance, setBalance] = useState();
    const [balanceLoading, setBalanceLoading] = useState(true)

    const updateBalance = useCallback(async () => {
        if (active) {
            setBalanceLoading(true)
            const b = await tokenContract.methods.balanceOf(account).call();
            setBalance(b)
            setBalanceLoading(false)
        }

    }, [tokenContract, account, active])

    useEffect(() => {
        updateBalance().then()
    }, [updateBalance])

    return {balance, balanceLoading, updateBalance}
};

export const useBalanceOfBUSD = () => {
    const contact = useBUSDContract()
    return useBalanceOfToken(contact)
};

export const useBalanceOfMMPRO = () => {
    const contact = useMMProContract()
    return useBalanceOfToken(contact)
};