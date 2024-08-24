//this custom hook will fetch data from gw2 api endpoints
import React from "react";
import { ApiKeyType } from "../components/api/apitype";
import { EndpointType } from "../endpoints/endpointtype";


const useFetch = (currentApiKey: ApiKeyType,
    endpoint: EndpointType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setErr: React.Dispatch<React.SetStateAction<boolean>>,
    ) => {

    const abortController = new AbortController();

    const baseUrl = "https://api.guildwars2.com";
    const fetchLink = endpoint.keyReq 
    ? 
    `${baseUrl}${endpoint.url}?access_token=${currentApiKey.key}`
    :
    `${baseUrl}${endpoint.url}`
        
    setLoading(true);
    setErr(false);
    
    let timer = true;
        
        const result = fetch(fetchLink, {signal: abortController.signal})
        .then((res) =>{
            return res.json();
        }).then((data) =>{
            timer = false;
            setLoading(false)
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
