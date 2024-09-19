import { useEffect, useState } from "react";
import styles from "./bankInfo.module.css"
import { findItemColor, handleMouseEnter, handleMouseExit, ItemCard, ItemType } from "../ItemCard";
import useItemFetch, { itemIdType } from "../../../hooks/useItemFetch";

const BankInfo = ({data} : {data: any}) => {
    

    const [tabAmount, setTabAmount] = useState<number[]>([])
    const [itemIds, setItemIds] = useState<itemIdType[]>([])
    const [items, setItems] = useState<ItemType[]>([])
    const [usedSpace, setUsedSpace] = useState(0)
    const [icons, setIcons] = useState<{[key: string]: any}>()
    const [leftPos, setLeftPos] = useState(0);
    const [topPos, setTopPos] = useState(0);
    const [bankTab, setBankTab] = useState<{display: boolean, item?: any[]}[]>([{display: true}]);
    useEffect(() =>{
        const slotAmount = 30; //this is the number of item slots that are available in a single bank tab.
        //therefore the amount of tab amount is data.length divided by 30.
        const totalTabs = data.length / slotAmount;
        const x = []
        for (let i = 0; i < totalTabs; i++) {
            x.push(i)
        }
        setTabAmount([...x])
        //when page renders, get the item id's.
        data.map((d: any, index: number) =>{
            if (d) {
                const {id, count} = d;
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
    const fetchProps = {
        itemIds, setItems, setUsedSpace
    }
    useEffect(() =>{
        useItemFetch(fetchProps);
    }, [itemIds, setItemIds])

    useEffect(()=>{
        handleIcons();
    }, [items, leftPos, topPos])

    useEffect(() =>{ 
        makeTabs();
    }, [icons])

    function makeTabs(){
        setBankTab([])
        if (icons?.length > 0 ) {
            for (let i = 0; i < tabAmount.length; i++) {
                const x = icons?.splice(0, 30);
                setBankTab(t => [...t, {item: x, display: bankTab[i]?.display}])
            }
        }
    }

    function handleTabDisplay(index: number){
        setBankTab(bankTab.map((tab, i) => {
            if (index === i) {
              return { ...tab, display: !tab.display };
            } else {
              return tab;
            }
          }));
    }

    function handleIcons (){
        if (items) {
            const nextIcons: any[] = []
            items && items.map((item, i) => {
            const borderColor = findItemColor(item.rarity);
            const x = { image: <img onMouseEnter={() => handleMouseEnter(i, setTopPos, setLeftPos)} 
                                onMouseLeave={() => handleMouseExit(i)} 
                                style={{border: `${borderColor} 2px solid`, width: "50px"}} src={item.icon}></img>, 
                        count: <div className={styles.itemCount}>{item.count}</div>,
                        description: <span id={String(i)}  className="inactiveCard" style={{position: "relative"}}> <ItemCard topPos={topPos} leftPos={leftPos} item={item} /> </span> }
            nextIcons.push(x);
            setIcons(nextIcons)
            })
        }
    } 
    
    return ( 
        <>
        {items.length !== 0 && <p style={{textAlign:"center"}}>You are using <b>{usedSpace}/{items.length}</b> of your bank.</p>}
        {bankTab && bankTab.map((tab, i) => (
            <div key={i}>
                <h1 className={styles.tabName} onClick={() => handleTabDisplay(i)}>Tab: {i+1}</h1>    
                <div className={styles.bankTab}>
                {tab && tab.item?.map((x: any, i:number)=> (
                    <span key={i} className={tab.display ? "" : styles.inactiveTab}> <span className={styles.itemCountContainer}>{x.image} {x.count} </span>{x.description} </span>
                ))}
                </div>
            </div>
        ))}
    </>
     );
}
 
export default BankInfo;