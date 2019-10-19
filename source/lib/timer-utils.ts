import { ITimerParams } from "./interfaces/i-timer-params";
import { TimerUnit } from "./timer-unit";
import { BusinessDay } from "./interfaces/i-business-day";
import { Timer } from "./timer";


export class TimerUtils  {
    

    constructor(){
    }
    
    static getMonth(date: Date){
        const MONTH = date.getMonth() + 1  ;
        return (MONTH < 10)? "0" + MONTH: MONTH ;
    }

    static getDay(date: Date){
        return (date.getDate() < 10)? "0" + date.getDate(): date.getDate() ;
    }

    static getFormatedDate(date: Date){
        const YEAR = date.getFullYear();
        const MONTH = this.getMonth(date) ;
        const DAY = this.getDay(date);
        return `${YEAR}-${MONTH}-${DAY}` ;
    }


    static getDaysBetween(from: Date, to: Date ){

        return Math.ceil( ( from.getTime() - to.getTime() ) / TimerUnit.DAYS );
    }


}