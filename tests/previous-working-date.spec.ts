import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Get Next Working Day Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });

  it('should be previous day first shift, on submit in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-24');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.getPreviousWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-23 08:00'));

  });

  it('should be before 3 days , on submit in shift time last day of week and first day of week is vacation', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-29');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.getPreviousWorkingDay(day);

    expect(nextWorkingTime).to.be.eql(new Date('2019-07-25 08:00'));

  });

  it('should be previous day first shift start time , on submit before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-23');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.getPreviousWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 08:00'));

  });

  it('should be previous exceptional working day first shift , on submit day before weekend and exceptional working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(19,0)
    let nextWorkingTime = timerInstance.getPreviousWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-19 10:00'));

  });

});