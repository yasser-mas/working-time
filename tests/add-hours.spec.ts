import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Add Hours Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should next hour, on submit in shift time +1 HOUR', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , 'HOURS');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 13:00'));

  });


  it('should after two hours, on submit in shift time +2 HOUR', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(10,0);
    let nextWorkingTime = timerInstance.add(day, 2 , 'HOURS');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 12:00'));

  });


  it('should be next window after one hour, on submit in first window before 1 hour from window end time +2 HOUR', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.add(day, 2 , 'HOURS');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 17:00'));

  });

  it('should be next day first window after one hour, on submit in last window before 1 hour from window end time +2 HOUR', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(19,0);
    let nextWorkingTime = timerInstance.add(day, 2 , 'HOURS');
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-23 09:00'));

  });

  it('should be after tomorrow, on submit hours more than tomorrow working time +10 hHOURS', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(22,0);
    let nextWorkingTime = timerInstance.add(day, 10 , "HOURS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-24 12:00'));

  });

    
  it('should next window after 2 hours , on submit before window +2 HOURS', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.add(day, 2 , "HOURS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 10:00'));

  });

  it('should be after 3 days, on submit time after last shift last day in the week and first day next week is vacation +2 hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(21,0)
    let nextWorkingTime = timerInstance.add(day, 2 , "HOURS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-29 10:00'));

  });

  it('should be after one day, on submit weekend time +2 HOUR', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-20');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "HOURS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-21 10:00'));

  });

  it('should be after two hours, on submit exceptional working time +2 HOURS', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(15,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "HOURS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-16 17:00'));

  });

  it('should be next exceptional day after two hours, on submit before exceptional day after working time +2 HOURS', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-15');
    day.setHours(23,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "HOURS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-16 16:00'));

  });

  
});