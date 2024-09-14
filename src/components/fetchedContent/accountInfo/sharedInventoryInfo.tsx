import { useEffect, useState } from "react";
import { ItemType, ItemCard, findItemColor, handleMouseEnter, handleMouseExit } from "../ItemType";
import placeholder from "../../../assets/placeholder.png"
import styles from "./sharedInventoryInfo.module.css"
import itemCardStyles from "./../itemcard.module.css"
import useItemFetch from "../../../hooks/useItemFetch";

const SharedInventoryInfo = ({data:data} :  any) => {
    const [itemIds, setItemIds] = useState<number[]>([])
    const [tempItems, setTempItems] = useState<ItemType[]>([])
    const [items, setItems] = useState<ItemType[]>([])
    const [descriptions, setDescriptions] = useState<{[key: string]: any}>()
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);

    //Level80 boost, although having an id like any other item, does not return anything through a fetch from the items endpoint.
    //I could not find any information regarding this -- it can be hardcoded using its id (78599) if necessary. I don't deem it necessary at the moment.
    //As that shared inventory slot occupied by the boost cannot be used for any other item until the boost is consumed anyway.
    useEffect(() =>{
        //when page renders, get the item id's.
        data.map((d: any) =>{
            if (d) {
                const {id} = d;
                setItemIds(i => [...i, id]);
            } else {
                setItemIds(i => [...i, 0]); //I am using 0 as a placeholder for null values. I am going to place an empty icon there
            }
        })
        return() =>{
            setItemIds([]);
        }
    },[])
    //once the item ids are saved, we can fetch the item data.
    useEffect(() =>{
        useItemFetch(itemIds, setTempItems);
    }, [itemIds, setItemIds])
    //after the items are fetched they are first saved in a temporary array
    //so that I can populate a new array with Empty slots as well
    useEffect(() => {
        checkEmptySpots();
    }, [tempItems])

    useEffect(()=>{
        handleIcons();
    }, [items, leftPos, topPos])

    function checkEmptySpots(){
        //save the index numbers of empty slots.
        //if no empty spots, temporary items must be the full list
        const emptySlots: number[] = []
        itemIds.map((id, i) => {
            if (id === 0) {
                emptySlots.push((i));
            }
        })
        if (emptySlots.length) {
            const emptyItem: ItemType = {icon: placeholder, level: 0, description: "This slot appears to be empty", rarity: "", id:0, details: {}}
            const oldList = [...tempItems]
            emptySlots.forEach(slot =>{
                console.log(slot);
                
                oldList.splice(slot, 0, emptyItem)                
            })
            setItems(oldList);
        } else {
            setItems(tempItems)
        }
    }

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

    return ( 
        <>
            {items.length !== 0 && <p style={{textAlign:"center"}}>Found <b>{items.length}</b> items in your shared inventory.</p>}
            <div className={styles.sharedInvIconContainer}>
                {descriptions && descriptions.map((x: any, i:number)=> (
                    <div key={i}> {x.image} {x.description} </div>
                ))}
            </div>
        </>
     );
}
 
export default SharedInventoryInfo;