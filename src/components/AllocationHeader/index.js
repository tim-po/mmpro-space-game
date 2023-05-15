import React, {useContext} from 'react';
import texts from './localization'
import LocaleContext from "../../Standart/LocaleContext";
import {localized} from "../../Standart/hooks/localized";

export const AllocationHeader = () => {
    const {locale} = useContext(LocaleContext)
    return (
        <div key={locale} className="w-full py-6 text-center">
            <div className="staking-text-and-stats-flex flex items-center justify-between w-full mt-6 px-4 pb-4">
                <div className="staking-page-main-text-container text-left">
                    <p className="mb-0 font-semibold md:text-5xl text-4xl">{localized(texts.AllocationMarket, locale)}</p>
                    <p className="mb-3 font-light md:text-1xl text-1xl">{localized(texts.Subtitle, locale)}</p>
                    <p className="mb-2 font-light md:text-2xl text-2xl">
                        {localized(texts.ConnectWalletMessage, locale)}
                    </p>
                    <p className="mb-2 font-light md:text-2xl text-2xl italic">
                        {localized(texts.MetamaskPricesMessage, locale)}  <a href={'https://t.me/mmpro_game_bot'} style={{color: "green"}}>@mmpro_game_bot</a>
                    </p>
                </div>
            </div>
        </div>
    )
};
