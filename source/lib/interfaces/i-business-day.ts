import { IWorkingHours } from "./i-working-hours";

export class BusinessDay {

    // isVacation: boolean;
    // isWeekend: boolean;

    constructor(
        public isWeekend: boolean,
        public isVacation: boolean,
        public isExceptional: boolean,
        public workingHours: IWorkingHours[],
    ){

    }
    
}