import { ItemType } from "../components/fetchedContent/ItemCard";
import placeholder from "./../assets/placeholder.png"

export type itemIdType = {
    id: number;
    i: number;
    count?: number
}
type Props = {
    itemIds: itemIdType[],
    setItems: React.Dispatch<React.SetStateAction<any[]>>,
    setUsedSpace?: React.Dispatch<React.SetStateAction<number>> 
}
export default function useItemFetch({itemIds, setItems, setUsedSpace} : Props ){

        if (itemIds.length > 0) {
            const allItems: ItemType[] = []
            fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds.map(item => item.id)}`)
            .then(res =>{
                if (res.ok) {
                    return res.json();
                }
            }).then(data =>{
                const emptyItem: ItemType = {icon: placeholder, level: 0, description: "This slot appears to be empty", rarity: "", id:0, details: { description: ""}}
                //DUPLLICATE IDS ARE CAUSING PROBLEMS: multiple objects with the same item ids are not fetched with the fetchItems function
                //here I deal with duplicate items (as well as empty slots, which are essentially multiple items themselves)
                //get the items that are in the data, place them on their index on itemIds.
                //then get the items that ARE NOT in data (these are the empty spaces, put placeholders in their index on itemIds)
                itemIds.map(_item => {
                data.map((item: ItemType) => {
                        if (_item.id === item.id) {
                            allItems.splice(_item.i, 0, {...item, count: _item.count})
                        }
                    })  
                    if (_item.id === 0) {
                        allItems.splice(_item.i, 0, emptyItem)
                    }
                })
                if (setUsedSpace) {
                    setUsedSpace(allItems.filter(item => item.id !== 0).length); //used inventory/bank space
                }
                setItems(allItems);
            })
        }
}

