import React, { createContext, useState } from "react";
import { ApiKeyType } from "./components/api/apitype.tsx";
import Footer from "./components/footer/Footer.tsx"
import Header from "./components/header/Header.tsx"
import ApiKey from "./components/api/ApiKey.tsx";
import Menu from "./components/menu/Menu.tsx";


const savedKeys = localStorage.getItem("savedKeys");
const keys: ApiKeyType[] = savedKeys ? JSON.parse(savedKeys) : [];

type StateContextType = {
  keyArray: ApiKeyType[];
  setKeyArray: React.Dispatch<React.SetStateAction<ApiKeyType[]>>;
  isMainKey: ApiKeyType;
  setIsMainKey: React.Dispatch<React.SetStateAction<ApiKeyType>>;
}

export const KeyArrayContext = createContext<null | StateContextType>(null);

type ContextProviderProps = {
  children: React.ReactNode;
};

const selectedKey = keys.filter(k => {
  if (k.mainKey) {
    return k;
  }
})

export const ContextProvider = ({children} : ContextProviderProps) => {
  const [keyArray, setKeyArray] = useState<ApiKeyType[]>(keys);
  const [isMainKey, setIsMainKey] = useState<ApiKeyType>(selectedKey[0])

  const value = {
    keyArray,
    setKeyArray,
    isMainKey,
    setIsMainKey,
  };

  return (
  <KeyArrayContext.Provider value={value}> 
    {children}
  </KeyArrayContext.Provider>
  )
}

function App() {

const [showApi, setShowApi] = useState(false);

  function handleApiClick(){
    setShowApi(!showApi)
    if (!document.getElementById("gw2e-logo")?.classList.contains("active")) {
      document.getElementById("gw2e-logo")?.classList.add("active");
    } else {
      document.getElementById("gw2e-logo")?.classList.remove("active");
    }
}
  function handleLogoClick(){
    if (showApi) {
      setShowApi(false)
      document.getElementById("gw2e-logo")?.classList.remove("active");
    }
  }

  return (
    <>
      
      <ContextProvider>
        <>
          <Header handleApiClick={handleApiClick} handleLogoClick={handleLogoClick} />
          {showApi && <ApiKey />}
          <Menu />
        </>
      </ContextProvider>
      <Footer />

    </>
  )
}

export default App;
