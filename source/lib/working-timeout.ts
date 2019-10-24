export default class WorkingTimeout {
    private timeoutMs: number ; 
    private timeoutID: NodeJS.Timeout ; 
    private  _fired: boolean = false ; 
    private  _cancelled: boolean = false ; 
    constructor( 
        private _baseDate: Date,
        private _fireDate: Date,
        private _duration: number,
        private _timeUnit: 'MINUTES' | 'HOURS' | 'DAYS'  ,
        private _callback: Function,
        private _description: string,
        
        ){
            this.timeoutMs = this._fireDate.getTime() - Date.now();
            this.initTimeout();
    }

    private initTimeout() {
        this.timeoutID =  setTimeout( ()=>{
            this._fired = true;
            this._callback();
        }, this.timeoutMs );
    }

    public clearTimeout() {
        this._cancelled = true;
        clearTimeout(this.timeoutID);
    }

    public get baseDate(): Date {
        return this._baseDate;
    }

    public get fireDate(): Date {
        return this._fireDate;
    }

    public get duration(): number {
        return this._duration;
    }

    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    public get callback(): Function {
        return this._callback;
    }
    public set callback(value: Function) {
        this._callback = value;
    }
    public get timeUnit(): 'MINUTES' | 'HOURS' | 'DAYS' {
        return this._timeUnit;
    }

    public get fired():boolean{
        return this._fired;
    }
    
    public get cancelled():boolean{
        return this._cancelled;
    }

    public get remainingTime(): number {
        return this._fireDate.getTime() - Date.now(); 
    }

}