import { useEffect, useState } from "react";
import { ItemType, ItemCard, findItemColor, handleMouseEnter, handleMouseExit } from "../ItemCard";
import styles from "./sharedInventoryInfo.module.css"
import useItemFetch, { itemIdType } from "../../../hooks/useItemFetch";

const SharedInventoryInfo = ({data:data} :  any) => {
    const [itemIds, setItemIds] = useState<itemIdType[]>([])
    const [items, setItems] = useState<ItemType[]>([])
    const [usedSpace, setUsedSpace] = useState(0)
    const [descriptions, setDescriptions] = useState<{[key: string]: any}>()
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);

    //Level80 boost, although having an id like any other item, does not return anything through a fetch from the items endpoint.
    //I could not find any information regarding this -- it can be hardcoded using its id (78599) if necessary. I don't deem it necessary at the moment.
    //As that shared inventory slot occupied by the boost cannot be used for any other item until the boost is consumed anyway.
    useEffect(() =>{
        //when page renders, get the item id's.
        data.map((d: any, index: number) =>{
            if (d) {
                const {id, binding, count} = d;
                console.log(binding, count);
                setItemIds(i => [...i, {id: id, i: index, count: count}]);
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


    function handleIcons (){
        const nextIcons: any[] = []
        items && items.map((item, i) => {
        const borderColor = findItemColor(item.rarity);
        const x = {image: <img onMouseEnter={() => handleMouseEnter(i, setTopPos, setLeftPos)} 
                            onMouseLeave={() => handleMouseExit(i)} 
                            style={{border: `${borderColor} 2px solid`, width: "50px"}} src={item.icon}></img>, 
                    count: <div className={styles.itemCount}>{item.count}</div>,
                    description: <span id={String(i)}  className="inactiveCard" style={{position: "relative"}}> <ItemCard topPos={topPos} leftPos={leftPos} item={item}/> </span>}
        nextIcons.push(x);
        })
        setDescriptions(nextIcons)
    } 

    return ( 
        <>
            {items.length !== 0 && <p style={{textAlign:"center"}}>Found <b>{usedSpace} / {items.length}</b> items in your shared inventory.</p>}
            <div className={styles.sharedInvIconContainer}>
                {descriptions && descriptions.map((x: any, i:number)=> (
                    <div key={i}> <div className={styles.itemCountContainer}>{x.image} {x.count} </div>{x.description} </div>
                ))}
            </div>
        </>
     );
}
 
export default SharedInventoryInfo;