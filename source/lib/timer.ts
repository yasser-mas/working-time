import { IWorkingHours, IExceptionalWindow } from "./interfaces/i-working-hours";
import { ITimerParams } from "./interfaces/i-timer-params";
import { TimerValidator } from "./timer-validator";
import { TimerUnit } from "./timer-unit";
import { BusinessDay } from "./interfaces/i-business-day";
import TimerError from "./timer-error";


export class Timer  {
    
    private bufferedCalender : Map <string,BusinessDay> = new Map();
    private timerValidator = new TimerValidator();
    private vacations: string[] ;
    private normalWorkingHours:  IWorkingHours;
    private exceptionalWorkingHours: IExceptionalWindow;
    private minBufferedDays: number;
    private maxBufferedDays: number;
    private timerParams: ITimerParams ;

    constructor(){
    }
    setConfig(
        timerParams: ITimerParams
    ) : Promise<Timer> {  
        this.timerParams = timerParams ;

        return new Promise((resolve, reject) => {
            
            try {
                this.timerValidator.validateVacations( timerParams.vacations );
                this.timerValidator.validateNormalWorkingDays( timerParams.normalWorkingHours );
                this.timerValidator.validateExceptionalWorkingDays( timerParams.exceptionalWorkingHours );
                this.timerValidator.validateMinBuffer( timerParams.minBufferedDays );
                this.timerValidator.validateMaxBuffer( timerParams.maxBufferedDays );
                this.constructWorkingDays(timerParams);
                // return this;
                resolve(this);
        
            } catch (error) {
                reject(new TimerError(error.message)) ;
            }

        });
        
      /*   try {
            this.timerValidator.validateVacations( timerParams.vacations );
            this.timerValidator.validateNormalWorkingDays( timerParams.normalWorkingHours );
            this.timerValidator.validateExceptionalWorkingDays( timerParams.exceptionalWorkingHours );
            this.timerValidator.validateMinBuffer( timerParams.minBufferedDays );
            this.timerValidator.validateMaxBuffer( timerParams.maxBufferedDays );
            this.constructWorkingDays(timerParams);
            return this;
    
        } catch (error) {
            throw new TimerError(error.message);
        } */
    }

    private getMonth(date: Date){
        const MONTH = date.getMonth() + 1  ;
        return (MONTH < 10)? "0" + MONTH: MONTH ;
    }
    private getDay(date: Date){
        return (date.getDate() < 10)? "0" + date.getDate(): date.getDate() ;;
    }

    private getFormatedDate(date: Date){
        const YEAR = date.getFullYear();
        const MONTH = this.getMonth(date) ;
        const DAY = this.getDay(date);
        return `${YEAR}-${MONTH}-${DAY}` ;
}

    private constructWorkingDays(timerParams: ITimerParams){

        let today = new Date().setHours(0,0,0,0);
        let startDate = today - ( TimerUnit.DAYS * Math.abs(timerParams.minBufferedDays));
        let endDate = today + ( TimerUnit.DAYS * Math.abs(timerParams.maxBufferedDays));


        for ( let i = startDate ; i <= endDate ; i += TimerUnit.DAYS ){
            let date = new Date(i);
            const FULLDAY = this.getFormatedDate(date) ;
            const BUSINESSDAY = new BusinessDay(false,false,false,[]);

            if ( timerParams.normalWorkingHours[date.getDay()] ) {
                BUSINESSDAY.workingHours = timerParams.normalWorkingHours[date.getDay()].sort((a,b)=>{
                    return a.from > b.from ? 1 : (a.from == b.from && a.to > b.to )? 1 : -1 ;
                });
            }else{
                BUSINESSDAY.isWeekend = true ;
            }
            
            if ( timerParams.exceptionalWorkingHours[FULLDAY]){
                BUSINESSDAY.isExceptional = true ;
                BUSINESSDAY.workingHours = timerParams.exceptionalWorkingHours[FULLDAY];
            }

            if ( timerParams.vacations.includes(FULLDAY)) {
                BUSINESSDAY.isVacation = true ;
                BUSINESSDAY.workingHours = [];

            }
            this.bufferedCalender.set(FULLDAY, BUSINESSDAY );
        }
    }
    

    private getDaysBetween(from: Date, to: Date ){

        return Math.ceil( ( from.getTime() - to.getTime() ) / TimerUnit.DAYS );
    }

    public get getBufferedCalender():Map <string,BusinessDay>  {
        return this.bufferedCalender ;
    }


    public getDayInfo( date: Date ): BusinessDay{
        let formatedDate = this.getFormatedDate(date);
        let bufferedDate = <BusinessDay> this.getBufferedCalender.get(formatedDate);
        if (!bufferedDate){
            const daysBetween = this.getDaysBetween(date , new Date()) ; 

            if (daysBetween > 0 ){
                this.timerParams.maxBufferedDays = daysBetween + 5 ;
            } else {
                this.timerParams.minBufferedDays = daysBetween - 5 ;

            }
            this.constructWorkingDays(this.timerParams);
            bufferedDate = <BusinessDay> this.getBufferedCalender.get(formatedDate);
        }
        return bufferedDate;
    }



    public isWorkingTime( date: Date ): boolean{
        const bufferedDate = this.getDayInfo(date);

        if ( bufferedDate.isVacation || bufferedDate.isWeekend ) {
            return false;
        }

        const requestedTime = date.getTime();
        const day = this.getFormatedDate(date);

        let inWindow = false ;
        bufferedDate.workingHours.forEach((window) => {
            const startTime = new Date(`${day} ${window.from}`).getTime();
            const endTime = new Date(`${day} ${window.to}`).getTime();
            if( 
                requestedTime >= startTime && 
                requestedTime < endTime 
                ){
                
                    inWindow = true ;
            }

        });

        return inWindow;
    }

    public getNextWorkingTime( date: Date ): Date{
        const bufferedDate = this.getDayInfo(date);
        let nextWindow: null | Date = null ; 

        if ( bufferedDate.isVacation || bufferedDate.isWeekend ) {
            let nextDaty = new Date( date.getTime() + TimerUnit.DAYS ).setHours(0,0,0,0);
            return this.getNextWorkingTime(new Date(nextDaty));
        }
        if (this.isWorkingTime(date)) {
            return date;
        }   

        const requestedTime = date.getTime();
        const day = this.getFormatedDate(date);

        bufferedDate.workingHours.forEach((window , index)=>{
            const startTime = new Date(`${day} ${window.from}`).getTime();
            const endTime = new Date(`${day} ${window.to}`).getTime();

            if(!nextWindow || nextWindow.getTime() > startTime  ){
                if( 
                    requestedTime >= startTime && 
                    requestedTime < endTime 
                    ){
                    
                        nextWindow =  date ;
                }else if (
                    startTime > requestedTime
                ) {
                    nextWindow =  new Date(startTime) ;
                }

            }
        });

        if ( !nextWindow ){
            let nextDaty = new Date( date.getTime() + TimerUnit.DAYS ).setHours(0,0,0,0);
            return this.getNextWorkingTime(new Date(nextDaty));
        }

        return nextWindow;
    
    }

    public add( date: Date , count: number , unit: 'MINUTES'|'HOURS'|'DAYS' ){
        let nextWindow = this.getNextWorkingTime(date);
        
        if (unit.toUpperCase() === 'DAYS' ){
            for (let index = 1; index <= count; index++) {
                let nextDate = new Date(nextWindow.setHours(0,0,0,0) + TimerUnit.DAYS);
                nextWindow = this.getNextWorkingTime(nextDate);
            }
            return nextWindow;
        }

        let timerMs = (unit.toUpperCase() === 'MINUTES' )? count *  TimerUnit.MINUTES : count * TimerUnit.HOURS ;

        console.log('nextWindow', nextWindow.toString());

        while ( timerMs !== 0 ){
            const day = this.getFormatedDate(nextWindow);
            const bufferedDate = this.getDayInfo(nextWindow);
            let nextWindowMs = nextWindow.getTime();
            console.log('timerMS', timerMs);

            bufferedDate.workingHours.forEach((window) => {
                const startTime = new Date(`${day} ${window.from}`).getTime();
                const endTime = new Date(`${day} ${window.to}`).getTime();
                if( 
                    nextWindowMs == startTime 
                    ){
                    
                    if ( endTime - startTime > timerMs) {
                        nextWindow = new Date( startTime +  timerMs);
                        timerMs = 0 ;
                    
                    }else{
                        nextWindow = this.getNextWorkingTime(new Date(endTime));
                        timerMs =  timerMs - (endTime - startTime); 
                    }
                }else if ( nextWindowMs > startTime && nextWindowMs < endTime  ) {
                    
                    if ( endTime - nextWindowMs > timerMs) {
                        nextWindow = new Date( nextWindowMs +  timerMs);
                        timerMs = 0 ;
                    }else{

                        nextWindow = this.getNextWorkingTime(new Date(endTime));
                        timerMs =  timerMs - (endTime - nextWindowMs); 
                    }
                }
    
            });
    
        }
        
        
        return nextWindow;
    }

}