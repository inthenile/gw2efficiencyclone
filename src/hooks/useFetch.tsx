//this custom hook will fetch data from gw2 api endpoints
import { useEffect, useState } from "react";
import { ApiKeyType } from "../components/api/apitype";
import { EndpointType } from "../endpoints/endpointtype";



const useFetch = (
    endpoint: EndpointType,
    currentApiKey: ApiKeyType | null | undefined,
    ) => {

    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(true);
    const [res, setRes] = useState<any>(null);
    const baseUrl = "https://api.guildwars2.com";
    const fetchLink = endpoint?.keyReq 
    ? 
    `${baseUrl}${endpoint?.url}?access_token=${currentApiKey?.key}&v=latest`
    :
    `${baseUrl}${endpoint?.url}&v=latest`
    
    
useEffect(() =>{
        
    const abortController = new AbortController();
    setLoading(true);
    let timer = true;
    
    fetch(fetchLink, {signal: abortController.signal})
    .then((res) =>{
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("There was an error with the result")
        }
    }).then((data) =>{
        timer = false;
        setRes(data);
        setLoading(false);
        setErr(false);
    }).catch((e) => {
        console.log(e);
        setLoading(false);
        timer = false;
        setRes(null)
        setErr(true);
    })

    //if API doesn't respond in 10 seconds, abort the call
    if (timer) {
        setInterval(() => {
            abortController.abort();
        }, 10000);
    }
    return() =>{
        abortController.abort();
    }
}, [currentApiKey, endpoint, setRes, setLoading, setErr])

        return {res, loading, err}
    }

export default useFetch;
