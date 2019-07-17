export interface IWorkingHours{

    from: string ;
    to: string;
}

export interface INormalWindow{

     [day:number] : IWorkingHours[] ;
}

export interface IExceptionalWindow{

     [date:string] : IWorkingHours[] ;
}