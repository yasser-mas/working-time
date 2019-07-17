import { IWorkingHours, INormalWindow, IExceptionalWindow } from "./i-working-hours";

export interface ITimerParams{

    vacations: string[];
    normalWorkingHours:INormalWindow;
    exceptionalWorkingHours:  IExceptionalWindow;
    minBufferedDays: number;
    maxBufferedDays: number;
}