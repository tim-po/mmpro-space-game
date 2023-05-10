import React from "react";
import './index.css'

export default ({title, className, noLine, children}) => {
    return (
        <div
            className={
                "border-card-container rounded-lg pb-4" +
                (className ? className : "")
            }
        >
            <div
                className={`font-Montserrat-ExtraBold text-white text-2xl uppercase pt-3 pb-4 ml-4 ${
                    noLine ? "" : "border-b border-dashed border-white"
                }`}
            >
                {title}
            </div>
            {children}
        </div>
    );
};
