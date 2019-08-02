import { Timer } from "./lib/timer";
import { VALID_TIMER_CONFIG } from './default-config';


export default class TimerFactory {

    private static timer: Timer | null ;

    public static getTimerInstance(): Timer {
        if (! this.timer){
            this.timer = new Timer();
        }
        return this.timer;
    }

    public static clearTimer(){
        this.timer = null ;
    }
}