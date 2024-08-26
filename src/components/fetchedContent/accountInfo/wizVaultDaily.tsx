import { useEffect } from "react";

const WizVaultDaily = () => {

    useEffect(() =>{
    console.log("mounted");

    return () => {
        console.log("unmounted");
    }
    
    },[])
    return ( 
        <h1>Some daily info</h1>
     );
}
 
export default WizVaultDaily;