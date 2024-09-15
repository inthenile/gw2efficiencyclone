import { useEffect, useState } from "react";
import itemCardStyles from "./../itemcard.module.css"
import styles from "./bankInfo.module.css"
import { findItemColor, handleMouseEnter, handleMouseExit, ItemCard, ItemType } from "../ItemType";
import useItemFetch from "../../../hooks/useItemFetch";

const BankInfo = ({data} : {data: any}) => {
    

    const [tabAmount, setTabAmount] = useState(0)
    const [itemIds, setItemIds] = useState<{id: number; i: number}[]>([])
    const [items, setItems] = useState<ItemType[]>([])
    const [usedSpace, setUsedSpace] = useState(0)
    const [descriptions, setDescriptions] = useState<{[key: string]: any}>()
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);
    
    useEffect(() =>{

        const slotAmount = 30; //this is the number of item slots that are available in a single bank tab.
        //therefore the amount of tab amount is data.length divided by 30.
        const totalTabs = data.length / slotAmount;
        setTabAmount(totalTabs)
        //when page renders, get the item id's.
        data.map((d: any, index: number) =>{
            if (d) {
                const {id} = d;
                setItemIds(i => [...i, {id: id, i: index}]);
            } else {
                setItemIds(i => [...i, {id: 0, i: index}]); //I am using 0 as a placeholder for null values. I am going to place an empty icon there
            }
        })
        return() =>{
            setItemIds([]);
        }
    },[])
    //once the item ids are saved, we can fetch the item data.
    useEffect(() =>{
        useItemFetch(itemIds, setItems, setUsedSpace);
    }, [itemIds, setItemIds])

    useEffect(()=>{
        handleIcons();
    }, [items, leftPos, topPos])

    useEffect(() => {
        
    }, [tabAmount])


    function handleIcons (){
        const nextIcons: any[] = []
        items && items.map((item, i) => {
        const borderColor = findItemColor(item.rarity);
        const x = {image: <img onMouseEnter={() => handleMouseEnter(i, setTopPos, setLeftPos)} 
                            onMouseLeave={() => handleMouseExit(i)} 
                            style={{border: `${borderColor} 2px solid`, width: "50px"}} src={item.icon}></img>, 
                    description: <span id={String(i)}  className="inactiveCard" style={{position: "relative"}}> <ItemCard topPos={topPos} leftPos={leftPos} item={item} styles={itemCardStyles}/> </span>}
        nextIcons.push(x);
        })
        setDescriptions(nextIcons)
    } 
    
    useEffect(() =>{
        
    }, [tabAmount])
    
    return ( 
        <>
        {items.length !== 0 && <p style={{textAlign:"center"}}>You are using <b>{usedSpace}/{items.length}</b> of your bank.</p>}
        <div className={styles.bankIconContainer}>
        {descriptions && descriptions.map((x: any, i:number)=> (
                <div key={i}> {x.image} {x.description} </div>
            ))}
        </div>
    </>
     );
}
 
export default BankInfo;