// ZipSizeContext.js
import React, { createContext, useContext, useState } from 'react';

const ZipSizeContext = createContext();

const ZipSizeProvider = ({ children }) => {
    const [zipSize, setZipSize] = useState(0);

    return (
        <ZipSizeContext.Provider value={{ zipSize, setZipSize }}>
            {children}
        </ZipSizeContext.Provider>
    );
};

export { ZipSizeProvider, ZipSizeContext };
