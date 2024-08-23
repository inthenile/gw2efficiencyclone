//this custom hook will fetch data from gw2 api endpoints
import { ApiKeyType } from "../components/api/apitype";
import { EndpointType } from "../endpoints/endpointtype";


const useFetch = (currentApiKey: ApiKeyType, endpoint: EndpointType) => {

    const baseUrl = "https://api.guildwars2.com";
    const fetchLink = endpoint.keyReq 
    ? 
    `${baseUrl}${endpoint.url}?access_token=${currentApiKey.key}`
    :
    `${baseUrl}${endpoint.url}`
    
        const result = fetch(fetchLink)
            .then((res) =>{
                return res.json();
            }).then((data) =>{
                return {data}
            }).catch((e) => {
                console.log(e);
            })

        return result;
}

export default useFetch;
