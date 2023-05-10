import React from "react";

export default (props) => {
  return (
    <div className="py-8" style={{minWidth: 340}}>
      <footer className="mx-auto px-4 flex flex-row justify-center text-center">
        <a
          href="https://twitter.com/MarketmakingPro"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4"
        >
          <img src="/images/sm-twitter.svg" alt="" width="20" />
        </a>
        <a
          href="https://t.me/market_making_pro_eng"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4"
        >
          <img src="/images/sm-telegram.svg" alt="" width="20" />
        </a>
        <a
          href="http://marketmaking.pro"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-4"
        >
          <span>v {props.version || "1.0.0"}</span>
        </a>
      </footer>
    </div>
  );
};
