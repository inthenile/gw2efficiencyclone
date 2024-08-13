//this custom hook will fetch data from gw2 api endpoints
import { ApiEndpoints } from "../components/api/ApiEndpoints";
import { ApiKeyType } from "../components/api/apitype";

const endPoint = ApiEndpoints.account;
const baseUrl = "https://api.guildwars2.com/";

const useFetch = (currentApiKey: ApiKeyType) => {

fetch(`${baseUrl}${endPoint}?access_token=${currentApiKey.key}`)

    .then((res) =>{
console.log(`${baseUrl}${endPoint}?access_token=${currentApiKey.key}`)

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
