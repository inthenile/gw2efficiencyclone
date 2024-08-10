//this custom hook will validate whether an api key is valid or not.
//if it is, it wil save it; otherwise, it will give an error.

import { useEffect, useState, useRef } from "react";
import { ApiKeyType } from "../components/api/apitype";

const useValidateKey = (apikey: ApiKeyType) => {

const [isValid, setIsValid] = useState(false);
const [err, setErr] = useState(false);
const fetchedData = useRef<any>([]);
const endPoint = "https://api.guildwars2.com/v2/account?access_token=";

useEffect(()=>{

    if(apikey.key.length > 0){
        fetch(`${endPoint}${apikey.key}`)
        .then((res) => {
            if (res.ok) {
                setIsValid(true);
                setErr(false);
                return res.json();
            }
            else{
                setIsValid(false)
                setErr(true);
                throw new Error("API key cannot be added. Please check the key you are trying to add.");
            }
        }).then((data) => {
            fetchedData.current = data
        })
        .catch((e) =>{
            console.log(e);
        })
    }
    return () =>{
        setIsValid(false);
    }
},[apikey])
    
    return {isValid, err, fetchedData}
}
 
export default useValidateKey;