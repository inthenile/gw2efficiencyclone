//this custom hook will fetch data from gw2 api endpoints
import { ApiKeyType } from "../components/api/apitype";
import { EndpointType } from "../endpoints/endpointtype";

const baseUrl = "https://api.guildwars2.com";

const useFetch = (currentApiKey: ApiKeyType, endpoint: EndpointType) => {

    const fetchLink = endpoint.keyReq 
    ? 
    `${baseUrl}${endpoint.url}?access_token=${currentApiKey.key}`
    :
    `${baseUrl}${endpoint.url}`
    console.log(fetchLink)

fetch(fetchLink)

    .then((res) =>{

        return res.json();
    }).then((data) =>{
        console.log(data);
    })

    return ( 
        <>
        </>
     );
}

export default useFetch;
