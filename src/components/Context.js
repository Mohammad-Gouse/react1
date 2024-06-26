// import React, { createContext, useState } from "react";

// // Create a new context
// const MenuContext = createContext();

// // Create a context provider component
// const MenuProvider = ({ children }) => {
//   const [showPMS, setShowPMS] = useState(false);
//   const [showNominee, setShowNomiee] = useState(false);
//   const [showConfig, setShowConfig] = useState(false);
//   const [showPmsOption, setShowPmsOption] = useState(false);
//   const [showNomineeOption, setShowNomineeOption] = useState(false);
//   const [showPoaOption, setShowPoaOption] = useState(false);

//   //   const togglePMS = () => {
//   //     setShowPMS((prevState) => !prevState);
//   //   };

//   return (
//     <MenuContext.Provider
//       value={{
//         showPMS,
//         setShowPMS,
//         showNominee,
//         setShowNomiee,
//         showConfig,
//         setShowConfig,
//         showPmsOption,
//         setShowPmsOption,
//         showNomineeOption,
//         setShowNomineeOption,
//         showPoaOption,
//         setShowPoaOption,
//       }}
//     >
//       {children}
//     </MenuContext.Provider>
//   );
// };

// export { MenuContext, MenuProvider };
import { createContext } from 'react';

const MenuContext = createContext({
  roles: [], // Initial value of roles array
  setRoles: () => {} // Dummy function placeholder
});

export default MenuContext;

