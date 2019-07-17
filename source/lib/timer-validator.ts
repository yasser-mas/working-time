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
    
    public validateVacations( vacations: string[]){
            
            vacations.forEach(vacation=>{
                if (this.invalidDateString(vacation))
                    throw new TimerError('Invalid Vacation Date !');
            });
    }
    public validateNormalWorkingDays( workingDays: INormalWindow ){

        if(!workingDays || Object.keys(workingDays).length === 0 ){
            throw new TimerError('You should provide at least one working day !')
        }

        let weekDays =  Object.keys(workingDays);
        weekDays.forEach(d=>{
            
            if ( this.invalidWeekDay(Number(d)) ) {
                throw new TimerError('Invalid Working Day => Day should be from 0 to 6 !');
            }
            

            workingDays[Number(d)].forEach(w =>{
                if ( this.invalidTime(w.from ) || this.invalidTime(w.to ) ){

                    throw new TimerError('Invalid Working Hours => Time should be hh:mm !');
                }
            });            

        });
        
    }
    public validateExceptionalWorkingDays(exceptionalWorkingHours: IExceptionalWindow ){
        
    }
    public validateMinBuffer(minBufferedDays: number){
        
    }
    public validateMaxBuffer(maxBufferedDays: number){
        
    }
}