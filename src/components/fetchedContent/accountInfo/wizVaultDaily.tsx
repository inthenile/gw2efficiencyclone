import styles from "./wizVaultDaily.module.css"
import wvwIcon from "../../../assets/dailies/WvW.png"
import pveIcon from "../../../assets/dailies/PvE.png"
import pvpIcon from "../../../assets/dailies/PvP.png"
import astralIcon from "../../../assets/dailies/astral_acclaim.png"
import taskComplete from "../../../assets/dailies/task_complete.png"
import taskIncomplete from "../../../assets/dailies/task_incomplete.png"
import { useState } from "react"

const WizVaultDaily = ({data: data}: any) => {

const [loading, setLoading] = useState(false)
const [err, setErr] = useState(false);
const { meta_progress_complete, 
        meta_progress_current, 
        meta_reward_claimed,
        objectives} = data;

type TaskType = {
    acclaim: number,
    claimed: boolean,
    id: number,
    progress_complete: number,
    progress_current: number,
    title: string,
    track: string
}


const dailyTask: TaskType[] = []

for (let i = 0; i < objectives?.length; i++) {
    const task = objectives[i];
    const {acclaim, claimed, progress_complete, id, progress_current, title, track} = task;
    dailyTask.push({acclaim: acclaim, id:id, claimed: claimed, progress_complete: progress_complete,progress_current: progress_current,title: title,track: track});
}

function findGameMode(x: TaskType){
    switch (x.track) {
        case "PvE":
            return <img src={pveIcon} alt="PvE Icon"></img>
        case "WvW":
            return <img src={wvwIcon} alt="WvW Icon"></img>
        case "PvP":
            return <img src={pvpIcon} alt="PvP Icon"></img>
    }
}

function checkProgress(x: TaskType){
    if (x.progress_current === x.progress_complete) {
        return <img src={taskComplete} alt="Task Completed"></img>
    } else {
        return <img src={taskIncomplete} alt="Task Incomplete"></img>
    }
}
//for the output of results
//tasks are reversed so the Log In reward, which is always completed, shows in the first place
const DailyCard = () => {
    return (
    <div className={styles.container}>
        {dailyTask && dailyTask.reverse().map(task => (
            <div key={task.id} className={`${task.progress_current === task.progress_complete ? styles.taskCardComplete : styles.taskCardIncomplete} ${styles.taskCard}`}>
                        {findGameMode(task)} <p> {task.title} </p>
                        <p> {task.progress_current} / {task.progress_complete} <br/>
                        <progress value={task.progress_current} max={task.progress_complete}></progress> <br/> 
                        {checkProgress(task)}</p>
                        <p> {task.acclaim} <img src={astralIcon} /></p>
            </div>
        ))}
    </div>
    )
}

    return ( 
        <>

            { !loading && !err &&
            <>
            <h1 style={{textAlign:"center"}}>Your Dailies:</h1>
                <DailyCard />
            </>
            }
        </>

     );
}
 
export default WizVaultDaily;


