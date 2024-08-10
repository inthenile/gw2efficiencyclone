import { useState } from "react";
import { ApiKeyType } from "./components/api/apitype.tsx";
import Footer from "./components/footer/Footer.tsx"
import Header from "./components/header/Header.tsx"
import ApiKey from "./components/api/ApiKey.tsx";
import Menu from "./components/menu/Menu.tsx";
function App() {
  
  const [showApi, setShowApi] = useState(false);
  const savedKeys = localStorage.getItem("savedKeys");

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
  const keyArray: ApiKeyType[] = savedKeys ? JSON.parse(savedKeys) : [];

  return (
    <>
      <Header handleApiClick={handleApiClick} handleLogoClick={handleLogoClick} keyArray={keyArray}/>
      {showApi && <ApiKey savedKeys={keyArray}/>}
      <Menu />
      <Footer />
    </>
  )
}

export default App;
