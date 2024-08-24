import { EndpointType } from "../../endpoints/endpointtype";
import AccountInfo from "./accountInfo/accountInfo";
import SharedInventoryInfo from "./accountInfo/sharedInventoryInfo";
import WizVaultDaily from "./accountInfo/wizVaultDaily";

const FetchContent = ({data: data, endpoint: endpoint} : {data: any, endpoint:EndpointType}) => {

    let result;
    
    switch (endpoint.url) {
        case "/v2/account":
            result = <AccountInfo data={data}/>
            break;

        case "/v2/account/wizardsvault/daily":
            result = <WizVaultDaily />
            break;
    
        case "/v2/account/inventory":
            result = <SharedInventoryInfo />
            break;
        case "v2/characters":
            result= <SharedInventoryInfo/>
            break;
        default:
            result = <div>"Nothing to see here"</div>
            break;
    }
    return ( 
        <div>
            {result}
        </div>

     );
}
 
export default FetchContent;