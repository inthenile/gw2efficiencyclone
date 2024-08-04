import { useState } from "react";
import { ApiKeyType } from "./components/api/apitype.tsx";
import Footer from "./components/footer/Footer.tsx"
import Header from "./components/header/Header.tsx"
import ApiKey from "./components/api/ApiKey.tsx";

function App() {
  
  const [showApi, setShowApi] = useState(false);
  const savedKeys = localStorage.getItem("savedKeys");

  function handleApiClick(){
    setShowApi(!showApi)
}
  let keyArray: ApiKeyType[] = savedKeys ? JSON.parse(savedKeys) : [];

  return (
    <>
      <Header handleApiClick={handleApiClick}/>
      {showApi && <ApiKey savedKeys={keyArray}/>}
      <Footer />
    </>
  )
}

export default App
