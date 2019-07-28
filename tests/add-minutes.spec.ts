import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Add Minutes Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should next hour, on submit in shift time +1 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(12,15);
    let nextWorkingTime = timerInstance.add(day, 1 , 'MINUTES');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 12:16'));

  });


  it('should next hour, on submit in shift time +20 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(12,15);
    let nextWorkingTime = timerInstance.add(day, 20 , 'MINUTES');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 12:35'));

  });

  it('should be next window after one hour, on submit in first window before 1 hour from window end time +120 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.add(day, 120 , 'MINUTES');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 17:00'));

  });

  it('should be next day first window after one hour, on submit in last window before 1 hour from window end time +120 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(19,0);
    let nextWorkingTime = timerInstance.add(day, 120 , 'MINUTES');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-23 09:00'));

  });


  it('should next window after 2 minutes , on submit before window +2 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.add(day, 2 , "MINUTES");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 08:02'));

  });

  it('should be after 3 days, on submit time after last shift last day in the week and first day next week is vacation +25 minutes', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(21,0)
    let nextWorkingTime = timerInstance.add(day, 25 , "MINUTES");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-29 08:25'));

  });

  it('should be after one day, on submit weekend time +2 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-20');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "MINUTES");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-21 08:02'));

  });


  it('should be after two MINUTES, on submit exceptional working time +2 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(15,16);
    let nextWorkingTime = timerInstance.add(day, 2 , "MINUTES");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-16 15:18'));

  });

  it('should be next exceptional day after two MINUTES, on submit before exceptional day after working time +2 MINUTES', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-15');
    day.setHours(23,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "MINUTES");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-16 14:02'));

  });


});