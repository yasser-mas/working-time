import { ITimerParams } from "./lib/interfaces/i-timer-params";
import { Timer } from "./lib/timer";

import { VALID_TIMER_CONFIG } from './default-config';


export default class TimerBuilder {

    private static timer: Timer  ;
    
    // private static timerParams: ITimerParams ;

    public static getTimerInstance(): Timer {

        if (! this.timer){
            this.timer = new Timer();
        }
        return this.timer;
    }
    /* public static  constructTimer( 
         timerParams: ITimerParams
    ){
        this.timerParams = timerParams;
    } */
}

const timer = TimerBuilder.getTimerInstance();
// console.time("set config");

timer.setConfig(VALID_TIMER_CONFIG);
// console.timeEnd("set config");

// process.stdin.resume();

// console.log(timer.getBufferedCalender);


console.log( 'Day Info -> ', timer.getDayInfo(new Date("07-14-2019")));
console.log( 'isWorkingTime -> ', timer.isWorkingTime(new Date("06-30-2019 20:20")));
console.log( 'getNextWorkingTime -> ', timer.getNextWorkingTime(new Date("06-30-2019 20:20")).toString());
// console.log( 'Add Days -> ', timer.add(new Date("06-30-2019 20:20"), 1 , 'DAYS').toString());
console.log( 'Add Minutes Or Hours -> ',timer.add(new Date("06-30-2019 20:15"), 2 , 'HOURS').toString());

