import { useEffect, useState } from "react";
import type { ApiKeyType } from "./apitype";
import styles from "./apiKey.module.css"; 
const ApiKey = ({savedKeys} : {savedKeys: ApiKeyType[] | null}) => {
    
const [apiKeys, setApiKeys] = useState<ApiKeyType[]> (savedKeys ? savedKeys : [])
const [isMainKey, setIsMainKey] = useState (false)

useEffect(() => {
//local storage logics
        const apiKeyList = JSON.stringify(apiKeys);
        localStorage.setItem("savedKeys", apiKeyList);
        
},[handleAddNewKey])

function handleAddNewKey(): void {

    let inputValue = (document.getElementById("api-adder") as HTMLInputElement).value;
    //10 api key limit
    if (apiKeys.length < 10 && inputValue.length > 0){
        let keyToAdd: ApiKeyType;
        //first key will be the main key
        apiKeys.length === 0 ? keyToAdd = {key: inputValue, mainKey: true} : keyToAdd = {key: inputValue, mainKey: false};
        setApiKeys(a => [...a, keyToAdd]);
        (document.getElementById("api-adder") as HTMLInputElement).value = "";
    } else if (apiKeys.length === 10){
        alert("You can have a maximum of 10 API Keys. Delete some.");
    }
}
function handleDeleteApiKey(index: number): void {
    if(confirm("Are you sure you want to delete this key?")){
        let newArray = apiKeys.filter((_, i) => i !== index);
        setApiKeys(newArray);
            if(newArray.length > 0 && apiKeys[index].mainKey){
                newArray.map((k) => {
                    k.mainKey = false;
                })
                newArray[0].mainKey = true
            }
    }
}
function handleMoveUp(index: number): void {
    if (index > 0) {
        const updatedArray = [...apiKeys];
        //if the item that is being moved is NOT a main key, just move its value, otherwise, move the mainKey property with it.
        !updatedArray[index].mainKey
        ?      
        [updatedArray[index].key, updatedArray[index-1].key] = [updatedArray[index-1].key, updatedArray[index].key]
        :
        [updatedArray[index].key, updatedArray[index-1].key] = [updatedArray[index-1].key, updatedArray[index].key],
        [updatedArray[index].mainKey, updatedArray[index-1].mainKey] = [updatedArray[index-1].mainKey, updatedArray[index].mainKey];
        
        setApiKeys(updatedArray);
    } 
}
function handleMoveDown(index: number): void {
    if (index < apiKeys.length - 1) {
        const updatedArray = [...apiKeys];
        //if the item that is being moved is NOT a main key, just move its value, otherwise, move the mainKey property with it.
        !updatedArray[index].mainKey
        ?      
        [updatedArray[index].key, updatedArray[index+1].key] = [updatedArray[index+1].key, updatedArray[index].key]
        :
        [updatedArray[index].key, updatedArray[index+1].key] = [updatedArray[index+1].key, updatedArray[index].key],
        [updatedArray[index].mainKey, updatedArray[index+1].mainKey] = [updatedArray[index+1].mainKey, updatedArray[index].mainKey];
        setApiKeys(updatedArray);
    }
}
function handleMakeMainKey(index: number): void{
    //make all other mainkey properties false before making another one true
    //this ensures there is only one mainKey property that is true.
    apiKeys.map((key) => {
            key.mainKey = false;
    })
    setIsMainKey(!isMainKey);
    apiKeys[index].mainKey = true;
}
    return ( 
        <>
            <div className={styles["api-container"]}>
                <h2>Your API Keys</h2>
                <ol>
                {apiKeys.map((apiKey, index) => <li className={styles["li-element"]} key={index}>
                    {/*Move BUTTON up*/}
                    <button className={styles["up-button"]} onClick={()=> handleMoveUp(index)}>⬆</button>
                    {/*Move BUTTON down*/}
                    <button className={styles["down-button"]} onClick={()=> handleMoveDown(index)}>⬇</button>

                    <span 
                        className={ apiKey.mainKey === true 
                        ? styles["api-key-active"] 
                        : styles["api-key-inactive"] } 
                    > {apiKey?.key.slice(0,15).concat("...")} </span>
                    
                    {/*USE THIS API KEY BUTTON*/}
                    {<button 
                    className={ apiKey.mainKey === false 
                    ? styles["make-main-active"] 
                    : styles["make-main-inactive"] } 
                    onClick={()=> handleMakeMainKey(index)}
                    disabled= {apiKey.mainKey === true 
                        ? true 
                        : false}
                    > Use </button>}
                    {/*DELETE BUTTON*/}
                    <button className={styles["delete-button"]} onClick={()=> handleDeleteApiKey(index)}>Delete</button>
                </li> )}
                </ol>
            </div>
            
            <div className={styles["add-new-api"]}>
                <input type="text" placeholder="Enter your API key" name="api-adder" id="api-adder" />
                {/*ADD BUTTON*/}
                <button className={styles["add-button"]} onClick={() => handleAddNewKey()}>Add New Key</button>
            </div>
        </>
    );
}
 
export default ApiKey;