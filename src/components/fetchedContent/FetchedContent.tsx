import { createContext } from "react";
import { EndpointType } from "../../endpoints/endpointtype";
import AccountInfo from "./accountInfo/accountInfo";
import SharedInventoryInfo from "./accountInfo/sharedInventoryInfo";
import WizVaultDaily from "./accountInfo/wizVaultDaily";

type StateContextType = {
    data: any
}

export const DataContext = createContext<null | StateContextType>(null);

const FetchContent = ({data: _data, endpoint: endpoint} : {data: any, endpoint:EndpointType}) => {
    
    type ContextProviderProps = {
        children: React.ReactNode;
    }
    const ContextProvider = ({children}: ContextProviderProps) => {
        const data = _data;
        const value ={
            data
        }
        return (
            <DataContext.Provider value={value}>
                {children}
            </DataContext.Provider>
        )
    }

    let result;
    switch (endpoint.url) {
        case "/v2/account":
            result = <AccountInfo/>
            break;
        case "/v2/account/wizardsvault/daily":
            result=  <WizVaultDaily />
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
        <ContextProvider>
            {result}
        </ContextProvider>
    )
}
 
export default FetchContent;