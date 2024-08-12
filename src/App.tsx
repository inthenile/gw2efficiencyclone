import { createContext, useContext, useState } from "react";
import { ApiKeyType } from "./components/api/apitype.tsx";
import Footer from "./components/footer/Footer.tsx"
import Header from "./components/header/Header.tsx"
import ApiKey from "./components/api/ApiKey.tsx";
import Menu from "./components/menu/Menu.tsx";

const savedKeys = localStorage.getItem("savedKeys");

const keyArray: ApiKeyType[] = savedKeys ? JSON.parse(savedKeys) : [];

export const KeyArrayContext = createContext<null | ApiKeyType[]>(keyArray);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const ContextProvider = ({children} : ContextProviderProps) => {
  const value = keyArray;
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
          <Header handleApiClick={handleApiClick} handleLogoClick={handleLogoClick} keyArray={keyArray}/>
          {showApi && <ApiKey savedKeys={keyArray}/>}
          <Menu />
        </>
      </ContextProvider>
      <Footer />

    </>
  )
}

export default App;
