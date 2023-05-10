/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from "react";

import {Allocation} from "./pages/Allocation";
import StandardAppContainer from "./Standart/StandardAppContainer";

export const App = () => {
  return (
      <StandardAppContainer showLocalisationControl={false} forcedLocale={'en'} version={'1.0.1'}>
        <Allocation/>
      </StandardAppContainer>
  );
};
