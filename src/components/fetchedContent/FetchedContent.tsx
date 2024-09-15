import { useEffect, useRef, useState } from "react";
import AccountInfo from "./accountInfo/accountInfo";
import Characters from "./accountInfo/characters/characters";
import SharedInventoryInfo from "./accountInfo/sharedInventoryInfo";
import WizVaultDaily from "./accountInfo/wizVaultDaily";
import BankInfo from "./accountInfo/bankInfo";


type Props = {
    url: string | undefined,
    _data: any
}

const FetchContent = ({url, _data}: Props) => {
    const data = useRef(_data);
    const [result, setResult] = useState<any>();
    
    useEffect(() => {
        data.current = _data;
            
        switch (url) {
            case "/v2/account":
                setResult(<AccountInfo data={data.current}/>)
                break;
            case "/v2/account/wizardsvault/daily":
                setResult(<WizVaultDaily data={data.current}/>)
                break;
            case "/v2/account/inventory":
                setResult(<SharedInventoryInfo data={data.current}/>)
                break;
            case "/v2/characters":
                setResult(<Characters data={data.current}/>)
                break;
            case "/v2/account/worldbosses":
                setResult(<div>"Testing"</div>)
                break;
            case "/v2/account/bank":
                setResult(<BankInfo data={data.current}/>)
                break;
            default:
                setResult(<div>"Nothing to see here"</div>)
        }

}, [_data])
    
    return result;
}
 
export default FetchContent;