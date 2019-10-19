import { Timer } from "./lib/timer";

 class TimerFactory {

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

module.exports = TimerFactory;
export default  TimerFactory;