import React, {useContext, useEffect, useState} from "react";
import Spinner from "../common/Spinner";
import {wei2eth} from "../../utils/common";
import {useAllocationMarketplaceContract, useBUSDContract, usePancakeRouterContract} from "../../hooks/useContracts";
import fromExponential from "from-exponential";
import {getAllocationMarketplaceAddress, getBUSDAddress, getMMProAddress} from "../../utils/getAddress";
import {useWeb3React} from "@web3-react/core";
import './index.css'
import {HidingText} from "../../Standart/components/HidingText";
import BigNumber from "bignumber.js";
import Button from "../common/Button";
import {useLocale} from "../../Standart/hooks/useLocale";
import texts from './localization'
import LocaleContext from "../../Standart/LocaleContext";
import {localized} from "../../Standart/hooks/localized";

const DEADLINE_OVER_NOW = 60 * 5 // 5 min
const ALLOWANCE = 10 ** 10 * 10 ** 18

const SLIPPAGE_PERCENT = 0.93 // 7 %


const LastNftDecoration = () => {
    const Crystal = () => {
        return(
            <svg width="19" height="52" viewBox="0 0 19 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.536063 33.9395L9.5 1.85802L18.4639 33.9395L9.5 50.452L0.536063 33.9395Z" fill="url(#paint0_linear_2_18)" stroke="url(#paint1_linear_2_18)"/>
                <defs>
                    <linearGradient id="paint0_linear_2_18" x1="23.5" y1="6.02732e-07" x2="-2.97502e-07" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF55FF"/>
                        <stop offset="1" stopColor="#FFA877"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_2_18" x1="17.5" y1="1" x2="3" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#903D76"/>
                        <stop offset="1" stopColor="#E44E74"/>
                    </linearGradient>
                </defs>
            </svg>
        )
    }

    return (
        <>
            <div className={"crystal right-top"}>
                <Crystal/>
            </div>
            <div className={"crystal right-bottom"}>
                <Crystal/>
            </div>

            <div className={"crystal left-bottom"}>
                <Crystal/>
            </div>
            <div className={"crystal left-middle"}>
                <Crystal/>
            </div>
            <div className={"crystal left-top"}>
                <Crystal/>
            </div>
        </>
    )
}

export const AllocationItem = ({tier, price, initAmount, updateBalance, balance}) => {
    const {account} = useWeb3React();
    const {locale} = useContext(LocaleContext)

    const calcTimeToWithdraw = (stakeEndTime, currentTime) => {
        const diffSecs = stakeEndTime - currentTime

        if (diffSecs <= 0) {
            return ''
        }
        const diff_in_days = Math.floor(diffSecs / 3600 / 24).toFixed(0);
        const diff_in_hours = Math.floor((diffSecs % (3600 * 24)) / 3600).toFixed(
          0
        );
        const diff_in_mins = Math.floor(
          ((diffSecs % (3600 * 24)) % 3600) / 60
        ).toFixed(0);
        const diff_in_secs = Math.floor((diffSecs % (3600 * 24)) % 3600) % 60;

        if(+diff_in_days > 0){
            return `${diff_in_days} ${localized(texts.Days, locale)}${+diff_in_hours > 0 ? `, ${diff_in_hours} ${localized(texts.hours, locale)}`: ''}`
        }

        return `${+diff_in_hours > 0 ? `${diff_in_hours}:` : ''}${(+diff_in_mins < 10 && +diff_in_mins > 0) ? '0': ''}${+diff_in_mins > 0 ? `${diff_in_mins}:` : ''}${diff_in_secs < 10 ? `0${diff_in_secs}`: `${diff_in_secs}`}`;

    };

    const INSUFFICIENT_BALANCE_ERROR_MESSAGE = localized(texts.InsufficientBalance, locale);
    const TRANSACTION_ERROR_MESSAGE = localized(texts.TransactionFailed, locale);

    const allocationMarketplaceContract = useAllocationMarketplaceContract();
    const pancakeRouterContract = usePancakeRouterContract();
    const BUSDContract = useBUSDContract()
    const [loadingBuy, setLoadingBuy] = useState(false)
    const [error, setError] = useState("")
    const [amount, setAmount] = useState(initAmount)
    const [currentTime, setCurrentTime] = useState(Math.floor(new Date().getTime() / 1000));
    const [loading, setLoading] = useState(false)
    const [claimable, setClaimable] = useState(0)
    const [numbers, setNumbers] = useState([])



    const displayError = (text, time) => {
        setError(text)
        setTimeout(()=>{
            setError("")
        }, time)
    }

    // async function mainButtonClicked(){
        // setLoading(true)
        // await allocationMarketplaceContract.methods.claimLocked(tier).send({from: account}).once('receipt', () => {
        //     geTicketData().then(data => setAllocationData(data))
        //     geTicketClaimable().then((newClaimable) => setClaimable(newClaimable))
        //     setLoading(false)
        // })
    // }

    // async function geTicketClaimable(){
        // return allocationMarketplaceContract.methods.availableToClaim(account, `${tier}`).call({from: account})
    // }

    // async function geTicketData(){
        // return allocationMarketplaceContract.methods.userLevelTokenInfo(account, tier).call({from: account})
    // }

    // const getMinAmountOut = async () => {
    //     const path = [getBUSDAddress(), getMMProAddress()]
    //     return new BigNumber((await pancakeRouterContract
    //         .methods
    //         .getAmountsOut(price, path)
    //         .call())[1])
    // }
    //
    // const getDeadline = () => {
    //     return Math.floor(new Date().getTime() / 1000) + DEADLINE_OVER_NOW;
    // }

    const getAllowance = async () => {
        return await BUSDContract
            .methods
            .allowance(account, getAllocationMarketplaceAddress())
            .call();
    }

    const approve = async () => {
        const amount2eth = fromExponential(ALLOWANCE);
        await BUSDContract
            .methods
            .approve(getAllocationMarketplaceAddress(), amount2eth)
            .send({from: account});
    };

    async function mint() {
        await allocationMarketplaceContract
            .methods
            .createGameNFT()
            .send({from: account}).once('receipt', ()=> {
                updateBalance()
          })
    }

    const handleBuy = async () => {
        if (loadingBuy){
            return
        }

        if (parseInt(price) > parseInt(balance)) {
            displayError(INSUFFICIENT_BALANCE_ERROR_MESSAGE, 2000);
            return
        }

        setLoadingBuy(true)
        try {
            const allowance = await getAllowance()
            if (parseInt(price) > parseInt(allowance)) {
                await approve()
            }
            await mint()
            await updateBalance()
            setError("")
            setAmount(+amount + 1)
        } catch (e) {
            displayError(TRANSACTION_ERROR_MESSAGE, 2000)
            console.log({error: e})
        }
        setLoadingBuy(false)

    }

    const videoRef = React.createRef();

    useEffect(()=>{
        if(videoRef.current){
            videoRef.current.playbackRate = 0.7;
        }
    }, [videoRef])

    useEffect(()=>{
        setAmount(+initAmount)
    }, [initAmount])

    // const locked = allocationData && currentTime < allocationData.intitialUnlockAvailableAt
    // const allClaimed = (allocationData.totalReserved - allocationData.totalClaimed === 0) && allocationData.totalClaimed > 0
    // const timeLeft = calcTimeToWithdraw(allocationData.intitialUnlockAvailableAt, currentTime)

    console.log('balance inner', amount, initAmount)

    return (
        <div
            className={'staking-element'}>
            {tier === 6 &&
                <LastNftDecoration/>
            }
            <div className={`nft-video-container ${amount > 0 && `border-t-${tier + 1}`}`}>
                {amount > 0 &&
                  <div className={'owned-marker'}>
                      {`${localized(texts.Owned, locale)} ${amount}`}
                  </div>
                }
                {/*{amount === 0 &&*/}
                {/*    <div className={'owned-marker'}>*/}
                {/*        Only {ticketAmount} left*/}
                {/*    </div>*/}
                {/*}*/}
              <video playsInline className={'nft-video '} ref={videoRef} style={amount > 0 ? {borderRadius: '20px 20px 0 0'}: {}} autoPlay loop muted>
                  <source src={`/videoBackgrounds/0${tier + 1}_300.mp4`} type="video/mp4" />
              </video>
                {price !== undefined && amount <= 0 &&
                <div className={'price'}>
                    {/*<div style={{fontSize: 22}}>*/}
                    {/*    {localized(texts.AllocationUpTo, locale)}: <b>{ticketAmount}</b>*/}
                    {/*</div>*/}
                    <div style={{fontSize: 17}}>
                        {localized(texts.Price, locale)}: {wei2eth(price)} BUSD
                    </div>
                </div>
                }
                {amount === 0 &&
                <button
                  onClick={handleBuy}
                  className={`buy-button ${(loadingBuy || error !== "") && 'paywall'} text-2xl`}
                  disabled={loadingBuy}
                >
                    {loadingBuy ? (
                      <Spinner size={25} color={'#FFFFFF'}/>
                    ) : (
                      <HidingText defaultText={amount === 0 ? localized(texts.Buy, locale): localized(texts.BuyMore, locale)} hidingText={error}
                                  peekOut={error !== ""}/>
                    )}
                </button>
                }
                {amount > 0 &&
                <div className={"ticket-container p-4 bg-black"}>
                    {/*<div className={"w-full"}>*/}
                    {/*    {*/}
                    {/*        `${localized(texts.YourTickets, locale)}: ${allocationData.lotteryTicketsIdFrom}${allocationData.lotteryTicketsIdFrom !== allocationData.lotteryTicketsIdTo ? ` - ${allocationData.lotteryTicketsIdTo}`: ''}`*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className={"w-full"}>*/}
                    {/*    {localized(texts.Locked, locale)}: <b>{parseFloat(wei2eth(allocationData.originalLockedAmount).toString()).toFixed(2)}</b> MMPRO*/}
                    {/*</div>*/}
                    {/*<div className={"w-full mb-4"}>*/}
                    {/*    {localized(texts.Claimable, locale)}: <b>{parseFloat(wei2eth(claimable).toString()).toFixed(2)}</b> MMPRO*/}
                    {/*</div>*/}
                    <div style={{fontSize: 17}}>
                        {localized(texts.Price, locale)}: {wei2eth(price)} BUSD
                    </div>
                    <button
                      onClick={handleBuy}
                      className={`buy-button ${(loadingBuy || error !== "") && 'paywall'} text-2xl`}
                      disabled={loadingBuy}
                    >
                        {loadingBuy ? (
                          <Spinner size={25} color={'#FFFFFF'}/>
                        ) : (
                          <HidingText defaultText={amount === 0 ? localized(texts.Buy, locale): localized(texts.BuyMore, locale)} hidingText={error}
                                      peekOut={error !== ""}/>
                        )}
                    </button>
                    {/* @ts-ignore */}
                    {/*<Button*/}
                    {/*  onClick={mainButtonClicked}*/}
                    {/*  className="unstake-button flex flex-row items-center w-48 justify-center"*/}
                    {/*  disabled={loading || allClaimed || locked}*/}
                    {/*  bgColor={(locked || allClaimed) ? 'gray-500' : 'primary'}*/}
                    {/*>*/}
                    {/*    {loading ? (*/}
                    {/*      <Spinner size={25} color={'#FFFFFF'}/>*/}
                    {/*    ) : (*/}
                    {/*      <>*/}
                    {/*          <img*/}
                    {/*            src={locked ? "/images/locked.svg" : "/images/unlocked.svg"}*/}
                    {/*            width="25"*/}
                    {/*            alt=""*/}
                    {/*          />*/}
                    {/*          <span className={`w-64`} style={locked ? {*/}
                    {/*              fontWeight: "bolder",*/}
                    {/*              fontSize: 16*/}
                    {/*          } : {}}> {locked ? timeLeft : (allClaimed ? localized(texts.AlreadyClaimed, locale) : localized(texts.Claim, locale))}</span>*/}
                    {/*      </>*/}
                    {/*    )}*/}
                    {/*</Button>*/}
                </div>
                }
            </div>
        </div>
    )

}