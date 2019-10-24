import { ITimerParams } from "./interfaces/i-timer-params";
import { TimerValidator } from "./timer-validator";
import { TimerUnit } from "./timer-unit";
import { BusinessDay } from "./interfaces/i-business-day";
import TimerError from "./timer-error";
import WorkingTimeout from "./working-timeout";
import { TimerUtils } from "./timer-utils";
import { resolve } from "path";
import { rejects } from "assert";


export class Timer  {
    
    private bufferedCalendar : Map <string,BusinessDay> = new Map();
    private timerValidator = new TimerValidator();
    private timerParams: ITimerParams ;
    private minBufferedDate: number ;
    private maxBufferedDate: number ;

    constructor(){
    }
    
    public setConfig(
        timerParams: ITimerParams
    ) : Timer {  
        this.timerParams = timerParams ;
        
        try {
            this.timerValidator.validateVacations( timerParams.vacations );
            this.timerValidator.validateNormalWorkingDays( timerParams.normalWorkingHours );
            this.timerValidator.validateExceptionalWorkingDays( timerParams.exceptionalWorkingHours );
            this.timerValidator.validateMinBuffer( timerParams.minBufferedDays );
            this.timerValidator.validateMaxBuffer( timerParams.maxBufferedDays );
            this.constructWorkingDays(timerParams, false);
            return this;
    
        } catch (error) {
            throw new TimerError(error.message);
        }
    }

    public async setConfigAsync(
        timerParams: ITimerParams
    ): Promise<Timer>{
        return this.setConfig(timerParams)
    }

    private constructWorkingDays(timerParams: ITimerParams , extend: boolean){
        let today = new Date().setHours(0,0,0,0);
        let startDate = today - ( TimerUnit.DAYS * Math.abs(timerParams.minBufferedDays));
        let endDate = today + ( TimerUnit.DAYS * Math.abs(timerParams.maxBufferedDays));
        let processedCalendar : Map <string,BusinessDay> = new Map();
        let append = null ; 

        if(extend){
            
            if(startDate < this.minBufferedDate ) {
               endDate =  this.minBufferedDate - TimerUnit.DAYS ;
               this.minBufferedDate = startDate;
               append = 'start';
            }
                            
            if (endDate > this.maxBufferedDate ){
                startDate =  this.maxBufferedDate + TimerUnit.DAYS ;
                this.maxBufferedDate = endDate;
                append = 'end';
            }  

        }else{

            this.minBufferedDate = startDate ; 
            this.maxBufferedDate = endDate;
        }

        for ( let i = startDate ; i <= endDate ; i += TimerUnit.DAYS ){
            let date = new Date(i);
            const FULLDAY = TimerUtils.getFormatedDate(date) ;
            const WILDCARDDAY = '*' + FULLDAY.substr(4) ;
            const BUSINESSDAY = new BusinessDay(false,false,false,[]);

            if ( timerParams.normalWorkingHours[date.getDay()] ) {
                BUSINESSDAY.workingHours = timerParams.normalWorkingHours[date.getDay()].sort((a,b)=>{
                    return a.from > b.from ? 1 : (a.from == b.from && a.to > b.to )? 1 : -1 ;
                });
            }else{
                BUSINESSDAY.isWeekend = true ;
            }
            
            if ( timerParams.exceptionalWorkingHours[FULLDAY] || timerParams.exceptionalWorkingHours[WILDCARDDAY] ){
                BUSINESSDAY.isExceptional = true ;
                BUSINESSDAY.workingHours = (timerParams.exceptionalWorkingHours[FULLDAY]) ?
                                                timerParams.exceptionalWorkingHours[FULLDAY] :
                                                timerParams.exceptionalWorkingHours[WILDCARDDAY];
            }

            if ( timerParams.vacations.includes(FULLDAY) || timerParams.vacations.includes(WILDCARDDAY) ) {
                BUSINESSDAY.isVacation = true ;
                BUSINESSDAY.workingHours = [];
            }
            processedCalendar.set(FULLDAY, BUSINESSDAY );
        }

        if(append){
            let oldBuffered = new Map(this.bufferedCalendar);
            this.bufferedCalendar.clear();
            
            if(append == 'start' ) {
                this.addToBuffer(processedCalendar);
                this.addToBuffer(oldBuffered);
            }
                            
            if (append == 'end' ){
                this.addToBuffer(oldBuffered);
                this.addToBuffer(processedCalendar);
            }

        }else{
            this.bufferedCalendar = processedCalendar;
        }
    }
    
    private addToBuffer( map:Map< string, BusinessDay>){
        map.forEach((val,key)=>{
            this.bufferedCalendar.set(key , val);
        }); 
    }

    

    public get getBufferedCalendar():Map <string,BusinessDay>  {
        return this.bufferedCalendar ;
    }


    public getDayInfo( date: Date ): BusinessDay {
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        let formatedDate = TimerUtils.getFormatedDate(date);
        let bufferedDate = <BusinessDay> this.getBufferedCalendar.get(formatedDate);
        if (!bufferedDate){
            const daysBetween = TimerUtils.getDaysBetween(date , new Date()) ; 

            if (daysBetween > 0 ){
                this.timerParams.maxBufferedDays = daysBetween + 5 ;
            } else {
                this.timerParams.minBufferedDays = daysBetween - 5 ;

            }
            this.constructWorkingDays(this.timerParams, true);
            bufferedDate = <BusinessDay> this.getBufferedCalendar.get(formatedDate);
        }
        return bufferedDate;
    }

    public async getDayInfoAsync(
        date: Date 
    ): Promise<BusinessDay>{
        return this.getDayInfo(date);
    }


    public workingTimeBetween( from: Date, to: Date  , unit: 'MINUTES'|'HOURS'|'DAYS'): Number {
        if ( !(from instanceof Date || to instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 
        if( from.getTime() > to.getTime()){
            throw new TimerError('From date should be less than to date !');
        }
        
        let count = 0 ;
       
        
        if (unit.toUpperCase() === 'DAYS' ){
            let bufferedDate = this.getDayInfo(from);
            let nextDate = new Date(from.setHours(24,0,0,0));

            while ( (   !(bufferedDate.isVacation || bufferedDate.isWeekend) &&
                         !bufferedDate.isExceptional ) &&
                    nextDate < to ) {
                count++;
                nextDate = new Date(from.setHours(24,0,0,0));
                bufferedDate = this.getDayInfo(nextDate);
            }
            return count;
        }

        let nextWindow = this.getNextWorkingTime(from);

        if( nextWindow.getTime() > to.getTime()){
            return 0 ;
        }

        while ( nextWindow.getTime() <= to.getTime() ){
            
            const day = TimerUtils.getFormatedDate(nextWindow);
            const bufferedDate = this.getDayInfo(nextWindow);

            bufferedDate.workingHours.forEach((window) => {
                const startTime = new Date(`${day} ${window.from}`).getTime();
                const endTime = new Date(`${day} ${window.to}`).getTime();
                let nextWindowMs = nextWindow.getTime();
                
                if( nextWindowMs >= startTime && 
                    nextWindowMs <= endTime && 
                    nextWindowMs <  to.getTime()  
                    ){
                    if ( endTime < to.getTime() ) {
                        count += ( endTime - nextWindowMs ) ;
                    }else{
                        count += ( to.getTime() - nextWindowMs ) ;
                    }
                    nextWindow = this.getNextWorkingTime(new Date(endTime));

                }
            });
        }
        
        return (unit.toUpperCase() === 'MINUTES' )? 
                        Number((count /  TimerUnit.MINUTES).toFixed(1)) : 
                        Number((count / TimerUnit.HOURS).toFixed(1)) ;
    }

    public async workingTimeBetweenAsync(
        from: Date, to: Date  , unit: 'MINUTES'|'HOURS'|'DAYS'
    ): Promise<Number>{
        return this.workingTimeBetween(from, to, unit);
    }

    
    public isWorkingTime( date: Date ): boolean{
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        
        const bufferedDate = this.getDayInfo(date);
        if ( bufferedDate.isVacation || ( bufferedDate.isWeekend && !bufferedDate.isExceptional )  ) {
            return false;
        }

        const requestedTime = date.getTime();
        const day = TimerUtils.getFormatedDate(date);

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

    public async isWorkingTimeAsync(
        date: Date 
    ): Promise<boolean>{
        return this.isWorkingTime(date);
    }

    public getNextWorkingTime( date: Date ): Date{
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        
        const bufferedDate = this.getDayInfo(date);
        let nextWindow: null | Date = null ; 

        if ( bufferedDate.isVacation || ( bufferedDate.isWeekend && !bufferedDate.isExceptional )  ) {
            let nextDaty = new Date( date.getTime() + TimerUnit.DAYS ).setHours(0,0,0,0);
            return this.getNextWorkingTime(new Date(nextDaty));
        }
        if (this.isWorkingTime(date)) {
            return date;
        }   

        const requestedTime = date.getTime();
        const day = TimerUtils.getFormatedDate(date);

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


    public async getNextWorkingTimeAsync(
        date: Date 
    ): Promise<Date>{
        return this.getNextWorkingTime(date);
    }


    public  getNextWorkingDay(
        date: Date 
    ): Date{
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        let tomorrow = new Date(date.setHours(24,0,0,0));
        return this.getNextWorkingTime(tomorrow);
    }

    public async getNextWorkingDayAsync(
        date: Date 
    ): Promise<Date>{
        return this.getNextWorkingDay(date);
    }



    public  getPreviousWorkingDay(
        date: Date 
    ): Date{
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        let prevDate = new Date(date.setHours(0,0,0,0) - TimerUnit.DAYS );
        let dayInfo = this.getDayInfo(prevDate);
        if ( (dayInfo.isVacation || dayInfo.isWeekend) && !dayInfo.isExceptional ) {
            return this.getPreviousWorkingDay(prevDate);
        }
        else {
            return this.getNextWorkingTime(prevDate);
        }
    }

    public async getPreviousWorkingDayAsync(
        date: Date 
    ): Promise<Date>{
        return this.getPreviousWorkingDay(date);
    }


    public add( date: Date , duration: number , unit: 'MINUTES'|'HOURS'|'DAYS' ): Date{
        if ( !(date instanceof Date) ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        // Get next working time 
        let nextWindow = this.getNextWorkingTime(date);
        
        if (unit.toUpperCase() === 'DAYS' ){
            for (let index = 1; index <= duration; index++) {
                let nextDate = new Date(nextWindow.setHours(0,0,0,0) + TimerUnit.DAYS);
                nextWindow = this.getNextWorkingTime(nextDate);
            }
            return nextWindow;
        }

        let timerMs = (unit.toUpperCase() === 'MINUTES' )? duration *  TimerUnit.MINUTES : duration * TimerUnit.HOURS ;

        while ( timerMs !== 0 ){
            const day = TimerUtils.getFormatedDate(nextWindow);
            const bufferedDate = this.getDayInfo(nextWindow);
            let nextWindowMs = nextWindow.getTime();

            bufferedDate.workingHours.forEach((window) => {
                const startTime = new Date(`${day} ${window.from}`).getTime();
                const endTime = new Date(`${day} ${window.to}`).getTime();

                // If it's the first shift
                if( 
                    nextWindowMs == startTime 
                    ){
                    // If shift will cover the remainig time so the required time is in this shift
                    if ( endTime - startTime > timerMs) {
                        nextWindow = new Date( startTime +  timerMs);
                        timerMs = 0 ;
                    
                    // If shift will not cover the remainig time?
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


    public async addAsync(
        date: Date , duration: number , unit: 'MINUTES'|'HOURS'|'DAYS'  
    ): Promise<Date>{
        return this.add(date, duration, unit);
    }

    public setWorkingTimeout(
        baseDate: Date , duration: number , unit: 'MINUTES'|'HOURS'|'DAYS', cb : Function, desc: string
    ): WorkingTimeout{
        if ( !(baseDate instanceof Date)  ){
            throw new TimerError('Invalid Date !');
        } 
        if ( this.bufferedCalendar.size === 0 ){
            throw new TimerError('Please set configuration !');
        } 

        let fireDate = this.add(baseDate, duration, unit);
        if ( fireDate.getTime() < Date.now() ){
            fireDate = this.getNextWorkingTime(new Date());
        }
        return new WorkingTimeout(baseDate, fireDate, duration, unit, cb, desc);
    }

    public setWorkingTimeoutAsync(
        baseDate: Date , duration: number , unit: 'MINUTES'|'HOURS'|'DAYS', cb : Function, desc: string
    ): Promise<WorkingTimeout>{
        return new Promise( (resolve,reject)=>{
            let workingTimeout: WorkingTimeout ; 
            try {
                workingTimeout = this.setWorkingTimeout(baseDate , duration , unit , cb, desc)
                resolve(workingTimeout);
            } catch (error) {
                reject(error);
            }
        });
    }
    




}