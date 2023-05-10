import React from 'react';

const LocaleContext = React.createContext({ setLocale: (newLocale: string)=>{}, locale: 'en' });

export default LocaleContext;
