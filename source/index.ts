import { Timer } from "./lib/timer";
import { VALID_TIMER_CONFIG } from './default-config';


export default class TimerFactory {

    private static timer: Timer | null ;

    public static getTimerInstance(): Timer {
        if (! this.timer){
            this.timer = new Timer();
        }
        return this.timer;
    }

    public static clearTimer(){
        this.timer = null ;
    }
}

const timer = TimerFactory.getTimerInstance();
console.time("set config");

/* timer.setConfigAsync(VALID_TIMER_CONFIG).then(t => {
    console.log(t.getBufferedCalendar);
}).catch(e =>{
    console.log(e.message);
}); */


async function test (){
    
     let t =    timer.setConfigAsync(VALID_TIMER_CONFIG).then(t=>{
        //  console.log(t.getBufferedCalendar);
        console.log('Async');
     }).catch(e =>{ console.log(e.message) ; console.log('Async')});
    //  if (t)
    //  console.log(t.getBufferedCalendar);

    try {
        let tSync =  timer.setConfig(VALID_TIMER_CONFIG);
        console.log(tSync.getBufferedCalendar);
        
    } catch (error) {
        console.log('sync');

        console.log(error.message);        
    }


    console.log('done');
    console.timeEnd("set config");

    // process.stdin.resume();

    // console.log(timer.getBufferedCalendar);


    console.log( 'Day Info -> ', timer.getDayInfo(new Date("07-14-2019")));
    // console.log( 'isWorkingTime -> ', timer.isWorkingTime(new Date("06-30-2019 20:20")));
    // console.log( 'getNextWorkingTime -> ', timer.getNextWorkingTime(new Date("06-30-2019 20:20")).toString());
    // // console.log( 'Add Days -> ', timer.add(new Date("06-30-2019 20:20"), 1 , 'DAYS').toString());
    // console.log( 'Add Minutes Or Hours -> ',timer.add(new Date("06-30-2019 20:15"), 2 , 'HOURS').toString());


    //  TimerFactory.clearTimer();
    //  console.log("as",TimerFactory.getTimerInstance);
}

// test();
