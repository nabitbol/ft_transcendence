import classes from './achievement-list.module.css'
import Achievement from '../achievement/achievement';


export function AchievementList() {

    const achievement_ID = [
        "1",
        "2",
    ];

    return (<div className={classes.achievement_container}>
                <div className={classes.achievement_content}>
                    <h2 className={classes.h2_title}>
                        Achievement
                    </h2>
                    <div className={classes.achievement_list}>
                        {achievement_ID.map(achievement_ID =>( <Achievement id={achievement_ID} key={achievement_ID}/>))}
                    </div>
                </div>
            </div>);
    
  }