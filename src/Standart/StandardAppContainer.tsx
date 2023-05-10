/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, {useEffect} from "react";
import Footer from "./components/Footer";
import {Header} from "./components/Header";
import {useConnectionCheck} from "./hooks/useConnectionCheck";
import {injected} from "./wallet";
import {useWeb3React} from "@web3-react/core";
import {useLocale} from "./hooks/useLocale";
import LocaleContext from "./LocaleContext";

const StandardAppContainer = (props: {children: any, forcedLocale?: string, showLocalisationControl?: boolean, isDarkBG?: boolean, version: string }) => {
  const {forcedLocale, showLocalisationControl, isDarkBG, version} = props
  // @ts-ignore
  const {active, activate, networkError} = useWeb3React();
  const {setLocale, locale} = useLocale(forcedLocale)
  useConnectionCheck()

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && !active && !networkError) {
        activate(injected);
      }
    });
  }, [activate, networkError]);

  return (
      <LocaleContext.Provider value={{setLocale, locale}}>
        <div className={`w-full overflow-hidden ${isDarkBG ? 'main-gradient': 'main-gradient-light'}`}
             style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: "space-between"}}>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: "flex-start"}}>
            <Header showLocalisationControl={showLocalisationControl}/>
            {props.children}
          </div>
          <Footer version={version}/>
        </div>
      </LocaleContext.Provider>
  );
};

export default StandardAppContainer;
