# Working Times

Working Times is a node js module to calculate working times and generating working hours calendar.
"Working Times" helps you to check if any day is working day or weekend or vacation  or even it's an exceptional working day.


# key features !

* Written in Typescript
* Zero dependencies
* Works on browsers and node js 
* Sync and Async 
* Supports multiple shifts 
* Supports Weekend 
* Supports Vacations 
* Supports exceptional working days 
* Old dates calculations
* Adding working days, hours and minutes to date 
* View date info 
* Check if certain time is working time or not ( past & current & future )
* Get nex working time from certain time 

##### Release 1.1.* +

* Set working timeout 



### Installation

Install via NPM:

```sh
$ npm install working-times
```


### How it works ?
-----------

When initializing timer and setting the configuration, timer module will buffer working calendar (from min buffered days to max ) which will contain all information about each day ( is vacation , is exceptional ,  is weekend , working hours). 
On asking timer module about any day it will get this day info if exists in the buffered calendar, if not exists ? timer will extend the buffered calendar ( past or future ) then get day info.

```ts
bufferedCalendar : Map <string,BusinessDay> ;
export class BusinessDay {
    constructor(
        public isWeekend: boolean,
        public isVacation: boolean,
        public isExceptional: boolean,
        public workingHours: IWorkingHours[],
    ){
    }
}
```


### Example
-----------

```diff
- All Synchronous should be in try and catch block because it will throw an error in case of errors 
```

 **Set Timer Config** 

```ts
import TimerFactory from 'working-times';
// Or 
const  timer  = require('working-times');


const timer = TimerFactory.getTimerInstance();

timer.setConfigAsync(VALID_TIMER_CONFIG).then(t => {
    console.log(t.getBufferedCalendar);
}).catch(e =>{
    console.log(e.message);
});

// Or 
// All Synchronous should be in try and catch block because it will throw an error in case of errors
try {
    let tSync =  timer.setConfig(VALID_TIMER_CONFIG);
} catch (error) {
    console.log(error.message);        
}

// Or 

let timer = await timer.setConfigAsync(VALID_TIMER_CONFIG).catch(e =>{ console.log(e.message) ; console.log('Async')});
if(timer){

}
```

**Check Date Info** 

```ts
// All Synchronous should be in try and catch block because it will throw an error in case of errors
try {
    timer.getDayInfo(new Date("07-14-2019"));
    timer.isWorkingTime(new Date("06-30-2019 20:20"));
    timer.getNextWorkingTime(new Date("06-30-2019 20:20"));
    timer.add(new Date("06-30-2019 20:20"), 1 , 'DAYS');
    timer.add(new Date("06-30-2019 20:15"), 2 , 'HOURS');
    timer.add(new Date("06-30-2019 20:15"), 2 , 'MINUTES');
} catch (error) {
    console.log(error.message);        
}

// Or 


timer.getDayInfoAsync(new Date("07-14-2019")).then(t => {
}).catch(e =>{
    console.log(e.message);
});

// Or 

let dayInfo = await timer.getDayInfoAsync(new Date("07-14-2019")).catch(e =>{
                        console.log(e.message);
                    });
if( dayInfo){

}

```




### DOCS
-----------

 **Construct Timer** 
 
To instantiate Timer you have to call getTimerInstance function and all subsequence times you will call this function it will return same instance

```ts
const timer = TimerFactory.getTimerInstance();
```

 **Set Timer Configuration** 

```ts
export const VALID_TIMER_CONFIG = {
    vacations: ['2019-07-31'],
    normalWorkingHours: {
      0: [
            // Sunday
       {
          from: '08:15',
          to: '14:00'
        },
        {
          from: '16:15',
          to: '20:00'
        }
      ],
      1: [
        {
          from: '08:00',
          to: '14:00'
        }
      ],
      2: [
        {
          from: '08:15',
          to: '14:00'
        }
      ],
      3: [
        {
          from: '08:15',
          to: '14:00'
        }
      ],
      4: [
        {
          from: '06:15',
          to: '14:00'
        }
      ]
    },
    exceptionalWorkingHours: {
      '2019-07-31': [
        {
          from: '12:15',
          to: '16:00'
        }
      ],
      '2019-06-26': [
        {
          from: '12:15',
          to: '16:00'
        }
      ]
    },
    minBufferedDays: 1,
    maxBufferedDays: 1
  }
```

* vacations
   vacations should be array list formated date "yyyy-mm-dd"

* normalWorkingHours
    normal working hours should contain all working week days only ( don't include weekend days ) 
    object key is day of the week (from 0 to 6), Sunday is 0, Monday is 1, and so on.
    object value is array list of working time ( time formate should be "hh:mm" )
    ```ts
        normalWorkingHours: INormalWindow[] ;
        export interface INormalWindow{
            [day:number] : IWorkingHours[] ;
        }
        export interface IWorkingHours{
            from: string ;
            to: string;
        }

    ```
* exceptionalWorkingHours
    exceptional working hours should be list of exceptional working days 
    object key is exceptional formated date "yyyy-mm-dd"
    object value is array list of working time ( time formate should be "hh:mm" )
    ```ts
        exceptionalWorkingHours: IExceptionalWindow[] ;
        export interface IExceptionalWindow{
            [date:string] : IWorkingHours[] ;
        }
        export interface IWorkingHours{
            from: string ;
            to: string;
        }

    ```

* minBufferedDays
    how many days in the past should be buffered on setting timer configuration

* maxBufferedDays
    how many days in the future should be buffered on setting timer configuration


 **View buffered calendar** 

Buffered canedar is javascript map of days infos 

```ts
    timer.setConfigAsync(VALID_TIMER_CONFIG).then(t=>{
         console.log(t.getBufferedCalendar);
     })


    bufferedCalendar : Map <string,BusinessDay>;
    export class BusinessDay {
        constructor(
            public isWeekend: boolean,
            public isVacation: boolean,
            public isExceptional: boolean,
            public workingHours: IWorkingHours[],
        ){
        }
    }
```


 **Get Date Info** 

To get date info you have to call getDayInfo function and it will return BusinessDay class 

```ts
    try {
        let dayInfo = timer.getDayInfo(new Date("2019-07-19"));
        console.log(dayInfo)
    } catch (error) {
        console.log(error.message);        
    }
  
    export class BusinessDay {
        constructor(
            public isWeekend: boolean,
            public isVacation: boolean,
            public isExceptional: boolean,
            public workingHours: IWorkingHours[],
        ){
        }
    }
    export interface IWorkingHours{
        from: string ;
        to: string;
    }

    // Or 

    timerInstance.getDayInfoAsync(day).then(d=>{
    }).catch(e =>{
    });

    // Or 

    let dayInfo = await timerInstance.getDayInfoAsync(day).catch(e =>{
    });

```


 **Is working Time?** 

To check if a specific time is working time or not you have to call isWorkingTime function and it will return boolean 


```ts
    try {
        let isWorkingTime = timer.isWorkingTime(new Date("2016-06-16 13:00"));
        console.log(isWorkingTime)
    } catch (error) {
        console.log(error.message);        
    }

    // Or 

    timerInstance.isWorkingTimeAsync(day).then(d=>{
    }).catch(e =>{
    });

    // Or 

    let isWorkingTime = await timerInstance.isWorkingTimeAsync(day).catch(e =>{
    });

```


 **Get Next Working Time** 

To next working time from a specific time you have to call getNextWorkingTime function and it will return a Date object 

```ts
    try {
        let nextWorkingTime = timer.getNextWorkingTime(new Date("2016-06-16 13:00"));
        console.log(nextWorkingTime)
    } catch (error) {
        console.log(error.message);        
    }

    // Or 

    timerInstance.getNextWorkingTimeAsync(day).then(d=>{
    }).catch(e =>{
    });

    // Or 

    let nextWorkingTime = await timerInstance.getNextWorkingTimeAsync(day).catch(e =>{
    });

```

 **Add Working Time To Date** 

To add working time to a specific time you have to call add function and it will return a Date object 

> PS: On adding X working days to a date time 
>     01- If this date time before working hours timer will count this day
>     02- If this date time is working time, timer will count this day 
>     03- If this date time after working hours timer will start count from tomorrow 


```ts

    timer.add( fromDate  , count , TimerUnit )
    // Allowed timer units 
    export enum TimerUnit {
      HOURS , // Default
      MINUTES ,
      DAYS  
    }

    try {
        let t = timer.add(new Date("2016-06-16 13:00"), 3 , "DAYS");
        let t = timer.add(new Date("2016-06-16 13:00"), 20 , "MINUTES");
        let t = timer.add(new Date("2016-06-16 13:00"), 7 , "HOURS");
        console.log(t)
    } catch (error) {
        console.log(error.message);        
    }

    // Or 

    timer.addAsync(day).then(d=>{
    }).catch(e =>{
    });

    // Or 
    let t = await timerInstance.addAsync(day).catch(e =>{
    });

```


 **Set working timeout** 

Sets a timer after adding ( X ) working time, which executes the given callback function once the timer expires.
Function will return WorkingTimeout Class

> PS: If time in the past after adding ( X ) working duration, the timer will be executed at the soonest working time 


```ts

  timer.setWorkingTimeout(
        baseDate: Date ,  // new Date()
        duration: number ,  // 10 
        unit: 'MINUTES'|'HOURS'|'DAYS', // MINUTES 
        cb : Function,  // ()=>{ console.log('fired')}
        desc: string  // 'Auto reject request #4354'
    );
    
    // returns WorkingTimeout
    class WorkingTimeout {
        public clearTimeout() {
        }

        public get baseDate(): Date {
        }

        public get fireDate(): Date {
        }

        public get duration(): number {
        }

        public get description(): string {
        }
        public set description(value: string) {
        }
        public get callback(): Function {
        }
        public set callback(value: Function) {
        }
        public get timeUnit(): 'MINUTES' | 'HOURS' | 'DAYS' {
        }

        public get fired():boolean{
        }
        
        public get cancelled():boolean{
        }

        public get remainingTime(): number {
        }

    }




    try {
        let day = new Date('2019-08-20');
        let cb = function(){
          return 1 ;
        }
        let timeout = timerInstance.setWorkingTimeout(day, 20 , 'MINUTES',cb , 'Timeout for confirm order #654');
        let timeout = timerInstance.setWorkingTimeout(day, 8 , 'HOURS',cb , 'Timeout for cancel order #654');
        let timeout = timerInstance.setWorkingTimeout(day, 5 , 'DAYS',cb , 'Timeout for refresh config ');
        console.log(timeout)
        
        // WorkingTimeout Getters 
        timeout.fireDate      // Return exact fire date ( Date )
        timeout.baseDate      // Return given date ( Date )
        timeout.duration      // Return duration from given date to the fire date ( in MS )
        timeout.description   // Return given description ( string)
        timeout.callback      // Return given callback funtion ( Function )  
        timeout.remainingTime // Return remaining time from now to the fire date ( in MS )  
        timeout.fired         // To check if timer fired or not ( boolean )
        timeout.cancelled     // To check if timer cancelled or not ( boolean )  
        timeout.clearTimeout  // To cancel timeout 

        timeout.callback = ()=>{}       // To update callback funtion 
        timeout.description = 'new Des' // To update timer description 

    } catch (error) {
        console.log(error.message);        
    }

```




### To do

 - Get next working day
 - Get previous working day
 - Subtract working time from given time
 - Working time between two times
 - Vacation wildcard


License
----

MIT

