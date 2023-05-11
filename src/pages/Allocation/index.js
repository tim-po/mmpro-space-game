import React, {useCallback, useContext, useEffect, useState} from "react";
import {AllocationHeader} from "../../components/AllocationHeader";
import {useWeb3React} from "@web3-react/core";
import {useAllocationMarketplaceContract} from "../../hooks/useContracts";
import {AllocationContainer} from "../../components/AllocationContainer";
import {wei2eth} from "../../utils/common";
import BorderCard from "../../components/common/BorderCard"
import {useBalanceOfBUSD} from "../../hooks/useBalance";
import {AllocationItem} from "../../components/AllocationItem";
import texts from './localization'
import LocaleContext from "../../Standart/LocaleContext";
import {localized} from "../../Standart/hooks/localized";

// const TIERS = [0, 1, 2, 3, 4, 5, 6];
const TIERS = [0];


export const Allocation = () => {
    const {active, account} = useWeb3React();
    const {locale} = useContext(LocaleContext)
    const allocationMarketplaceContract = useAllocationMarketplaceContract();

    const {balance, balanceLoading, updateBalance} = useBalanceOfBUSD(account)

    const [allocationBalance, setAllocationBalance] = useState(0);
    const [allocationPrice, setAllocationPrice] = useState(undefined);
    // const [allocationWorthArray, setAllocationWorthArray] = useState(Array(TIERS.length).fill(undefined));
    // const [ticketAmounts, setTicketAmounts] = useState(Array(TIERS.length).fill(undefined));

    const [loadingBalances, setLoadingBalances] = useState(false);
    const [loadingPrices, setLoadingPrices] = useState(false);

    const loadAllocationBalances = useCallback(async () => {
        if (active) {
            const balance = await allocationMarketplaceContract
                .methods
                .balanceOf(account)
                .call();
            console.log('balance', balance)
            setAllocationBalance(balance);
        }
    }, [active, account, allocationMarketplaceContract]);

    const loadAllocationPrices = useCallback(async () => {
        setLoadingPrices(true);
        let price = await allocationMarketplaceContract
          .methods
          .NFTprice()
          .call();

        setAllocationPrice(price);
        setLoadingPrices(false)
    }, [allocationMarketplaceContract]);

    useEffect(() => {
        setLoadingBalances(true);
        loadAllocationBalances()
            .then(() => setLoadingBalances(false));
    }, [loadAllocationBalances, active]);

    useEffect(() => {
        setLoadingPrices(true);
        loadAllocationPrices()
            .then(() => setLoadingPrices(false))
    }, [loadAllocationPrices]);

    const showConnectWallet = !active
    const showLoading = loadingBalances && loadingPrices
    const showAllocationBody = !showLoading && !showConnectWallet

    const balanceMessage = balanceLoading ? `${localized(texts.Loading, locale)}...` : `${localized(texts.Available, locale)}: ${wei2eth(balance)} BUSD`

    return (
        <div className="staking-page-container mx-auto pb-18 px-4 force-height">
            <AllocationHeader/>
            {showConnectWallet && <div className="text-center">{localized(texts.ConnectWallet, locale)}</div>}
            {showLoading && <div className="text-center">{localized(texts.Loading, locale)}...</div>}
            {showAllocationBody &&
            <BorderCard noLine title={balanceMessage}
                        className={' stake-configurator'}>
                <AllocationContainer>
                    {TIERS.map((tier, ind) =>
                      <AllocationItem key={tier} tier={tier} price={allocationPrice} initAmount={allocationBalance}
                                      updateBalance={updateBalance} balance={balance}/>
                    )}
                </AllocationContainer>
            </BorderCard>
            }

        </div>
    )
};

