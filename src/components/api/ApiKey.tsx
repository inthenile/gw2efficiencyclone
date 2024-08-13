import { useContext, useEffect, useState } from "react";
import { ApiKeyType } from "./apitype";
import styles from "./apiKey.module.css"; 
import useValidateKey from "../../hooks/useValidateKey";
import { KeyArrayContext } from "../../App";

const ApiKey = () => {

const keyContext = useContext(KeyArrayContext);
const savedKeys = keyContext?.keyArray;
const [isMainKey, setIsMainKey] = useState (false)
const [keyToAdd, setKeyToAdd] = useState<ApiKeyType>({key:"", mainKey:false})

const {isValid, err, fetchedData} = useValidateKey(keyToAdd);

useEffect(() => {
        //local storage logics  
        const apiKeyList = JSON.stringify(savedKeys);
        localStorage.setItem("savedKeys", apiKeyList);
    
},[savedKeys, isMainKey])

useEffect(()=>{
//check if the key is a valid API KEY, if it is, fetch the account name and add it to our apiKeytype, and then save it;
if (keyToAdd.key.length > 0 && isValid === true) {
    const fullKeyInfo: ApiKeyType = {key: keyToAdd.key, accountName: fetchedData.name, mainKey: keyToAdd.mainKey};
    keyContext?.setKeyArray(a => [...a, fullKeyInfo]);
}
}, [fetchedData])


function handleAddNewKey(): void {
    let inputValue = (document.getElementById("api-adder") as HTMLInputElement).value;
    //10 api key limit
    if (savedKeys !== undefined && savedKeys.length < 10 && inputValue.length > 0){
        //first key will be the main key

        savedKeys.length === 0 ? setKeyToAdd({key: inputValue, mainKey:true}) : setKeyToAdd(({key: inputValue, mainKey:false}));
        
        //the bug is that validKey variable is always one step behind.
        (document.getElementById("api-adder") as HTMLInputElement).value = "";
    } else if (savedKeys !== undefined && savedKeys.length === 10){
        alert("You can have a maximum of 10 API Keys. Delete some.");
    }
}
function handleDeleteApiKey(index: number): void {
    if(savedKeys !== undefined && confirm("Are you sure you want to delete this key?")){
        let newArray = savedKeys.filter((_, i) => i !== index);
        keyContext?.setKeyArray(newArray);
            if(newArray.length > 0 && savedKeys[index].mainKey){
                newArray.map((k) => {
                    k.mainKey = false;
                })
                newArray[0].mainKey = true
            }
    }
}
function handleMoveUp(index: number): void {
    if (savedKeys !== undefined && index > 0) {
        const updatedArray = [...savedKeys];
        //if the item that is being moved is NOT a main key, just move its value, otherwise, move the mainKey property with it.
        !updatedArray[index].mainKey
        ?      
        [updatedArray[index].key, updatedArray[index-1].key] = [updatedArray[index-1].key, updatedArray[index].key]
        :
        [updatedArray[index].key, updatedArray[index-1].key] = [updatedArray[index-1].key, updatedArray[index].key],
        [updatedArray[index].mainKey, updatedArray[index-1].mainKey] = [updatedArray[index-1].mainKey, updatedArray[index].mainKey];
        
        keyContext?.setKeyArray(updatedArray);
    } 
}
function handleMoveDown(index: number): void {
    if (savedKeys !== undefined && index < savedKeys.length - 1) {
        const updatedArray = [...savedKeys];
        //if the item that is being moved is NOT a main key, just move its value, otherwise, move the mainKey property with it.
        !updatedArray[index].mainKey
        ?      
        [updatedArray[index].key, updatedArray[index+1].key] = [updatedArray[index+1].key, updatedArray[index].key]
        :
        [updatedArray[index].key, updatedArray[index+1].key] = [updatedArray[index+1].key, updatedArray[index].key],
        [updatedArray[index].mainKey, updatedArray[index+1].mainKey] = [updatedArray[index+1].mainKey, updatedArray[index].mainKey];
        keyContext?.setKeyArray(updatedArray);
    }
}
function handleMakeMainKey(index: number): void{
    //make all other mainkey properties false before making another one true
    //this ensures there is only one mainKey property that is true.
    if (savedKeys !== undefined ) {
        savedKeys.map((key) => {
            key.mainKey = false;
    })
    setIsMainKey(!isMainKey);
    savedKeys[index].mainKey = true;
    }
}
    return ( 
        <>
            <div className={styles["api-container"]}>
                <h2>Your API Keys</h2>
                {err && <h4>"This API key is invalid. Please check it and re-enter."</h4>}
                <ol>
                {savedKeys && savedKeys.map((apiKey, index) => <li className={styles["li-element"]} key={index}>
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
                <button className={styles["add-button"]} onClick={() => handleAddNewKey()} >Add New Key</button>
            </div>
        </>
    );
}
 
export default ApiKey;