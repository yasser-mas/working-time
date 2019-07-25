import { IWorkingHours, INormalWindow, IExceptionalWindow } from "./interfaces/i-working-hours";
import TimerError from "./timer-error";

export class TimerValidator {

    constructor(){

    }

    private invalidDateString (date: string ): boolean {
        return isNaN( Date.parse(date)) ; 
          
    }
    
    private invalidWeekDay(day: number ): boolean {

        return  ( day < 0 || day > 6 ) ;

    }

    private invalidTime( time: string ){
        const TIME_REGEX = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;
        return !TIME_REGEX.test(time); 
    }
    private invalidRange( from: string , to: string ){
        const fromTime = new Date().setHours(Number(from.split(":")[0] ), Number(from.split(":")[1]) );
        const toTime = new Date().setHours(Number(to.split(":")[0] ), Number(to.split(":")[1]) ); 
        return toTime < fromTime; 
    }
    
    public validateVacations( vacations: string[]){
            vacations.forEach(vacation=>{
                if (this.invalidDateString(vacation)){
                    throw new TimerError(`Invalid Vacation Date "${vacation}" !`);
                }
            });
    }

    public validateNormalWorkingDays( workingDays: INormalWindow ){
        let weekDays =  Object.keys(workingDays);

        if(!workingDays || weekDays.length === 0 ){
            throw new TimerError('You should provide at least one working day !')
        }

        weekDays.forEach(d=>{
            if ( !d || isNaN(Number(d)) ||  this.invalidWeekDay(Number(d)) ) {
                throw new TimerError(`Invalid Working Day "${d}" => Day should be from 0 to 6 !`);
            }
            
            if(workingDays[Number(d)].length == 0) {

                throw new TimerError(`Invalid Working Day "${d}" => Day should contain one working minute at least !`);
            }

            workingDays[Number(d)].forEach(w =>{
                if ( !w.from || !w.to || this.invalidTime(w.from ) || this.invalidTime(w.to )){

                    throw new TimerError(`Invalid Working Hours "From: ${w.from} To: ${w.to}" => Time should be hh:mm !`);
                }
                if ( this.invalidRange(w.from , w.to ) ) {

                    throw new TimerError(`Invalid Working Hours "From: ${w.from} To: ${w.to}" => To should be greater than from !`);
                }
            });            

        });
        
    }
    public validateExceptionalWorkingDays(exceptionalWorkingHours: IExceptionalWindow ){
        let dates = Object.keys(exceptionalWorkingHours);
        dates.forEach(day => {
            if (this.invalidDateString(day)){
                throw new TimerError(`Invalid Exceptional Date "${day}" !`);
            }

            if(exceptionalWorkingHours[day].length == 0) {

                throw new TimerError(`Invalid Exceptional Working Day "${day}" => Day should contain one working minute at least !`);
            }

            exceptionalWorkingHours[day].forEach(w =>{
                if (  !w.from || !w.to || this.invalidTime(w.from ) || this.invalidTime(w.to ) ){

                    throw new TimerError(`Invalid Exceptional Working Hours "From: ${w.from} To: ${w.to}" => Time should be hh:mm !`);
                }
                if ( this.invalidRange(w.from , w.to ) ) {

                    throw new TimerError(`Invalid Exceptional Working Hours "From: ${w.from} To: ${w.to}" => To should be greater than from !`);
                }
            });
        });

    }
    public validateMinBuffer(minBufferedDays: number){
        if ( isNaN(minBufferedDays)){
            throw new TimerError('Invalid Minimum Buffered Days => Should be number !');
        }
        
    }
    public validateMaxBuffer(maxBufferedDays: number){
        if ( isNaN(maxBufferedDays)){
            throw new TimerError('Invalid Maximum Buffered Days => Should be number !');
        }
    }
}