import AccountInfo from "./accountInfo/accountInfo";
import SharedInventoryInfo from "./accountInfo/sharedInventoryInfo";
import WizVaultDaily from "./accountInfo/wizVaultDaily";


type Props = {
    url: string | undefined,
    data: any
}


const FetchContent = ({url, data}: Props) => {
 
    let result;
    switch (url) {
        case "/v2/account":
            result = <AccountInfo data={data}/>
            break;
        case "/v2/account/wizardsvault/daily":
            result=  <WizVaultDaily data={data}/>
            break;
        case "/v2/account/inventory":
            result= <SharedInventoryInfo />
            break;
        case "v2/characters":
            result = <SharedInventoryInfo/>
            break;
        default:
            result = <div>"Nothing to see here"</div>
    }

    return(
           result
    )
}
 
export default FetchContent;