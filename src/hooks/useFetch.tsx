//this custom hook will fetch data from gw2 api endpoints
import React from "react";
import { ApiKeyType } from "../components/api/apitype";
import { EndpointType } from "../endpoints/endpointtype";


const useFetch = (
    endpoint: EndpointType | undefined,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErr: React.Dispatch<React.SetStateAction<boolean>>,
    abortController: AbortController,
    currentApiKey?: ApiKeyType,
    ) => {

    ;
    
    const baseUrl = "https://api.guildwars2.com";
    const fetchLink = endpoint?.keyReq 
    ? 
    `${baseUrl}${endpoint?.url}?access_token=${currentApiKey?.key}`
    :
    `${baseUrl}${endpoint?.url}`
        
    
    let timer;   

    const result = fetch(fetchLink, {signal: abortController.signal})
    .then((res) =>{
        if (res.ok) {
            timer = true;
            setLoading(true);
            return res.json();
        } else {
            throw new Error("There was an error with the result")
        }
    }).then((data) =>{
        timer = false;
        return {data}
    }).catch((e) => {
        console.log(e);
        setLoading(false);
        timer = false;
        setErr(true);
    })

    //if API doesn't respond in 10 seconds, abort the call
    if (timer) {
        setInterval(() => {
            abortController.abort();
        }, 10000);

    }

    return result;
}

export default useFetch;
