import { ItemType } from "../components/fetchedContent/ItemType";

export default function useItemFetch(itemIds: number[], setTempItems:React.Dispatch<React.SetStateAction<ItemType[]>> ){

    //DUPLLICATE IDS ARE CAUSING PROBLEMS: multiple objects with the same item ids are not fetched with the fetchItems function
    //with this function we create duplicates if the same id exists in our array
    function checkDuplicates(data: ItemType[], duplicateItems: number[]){
        data.filter((item) => {
            duplicateItems.forEach(element => {
                if(item.id === element){
                    data.push(item);
                }
            });
        })
        setTempItems(data);
    }
        if (itemIds.length) {
            fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}`)
            .then(res =>{
                if (res.ok) {
                    return res.json();
                }
            }).then(data =>{
                const duplicateItems = itemIds.filter((item, i) => itemIds.indexOf(item) !== i)
                if (duplicateItems.length) {
                    checkDuplicates(data, duplicateItems);
                } else {
                    setTempItems(data);
                }
            })
        }
}

