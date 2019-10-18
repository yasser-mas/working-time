import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Get working time between Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('Shoul be zero days on submit the same working day', function() {
    const timerInstance = timer.setConfig(timerConfig);

    let formDay = new Date('2019-07-22 06:00:00');
    let toDay = new Date('2019-07-22 06:00:00');

    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "DAYS");
    expect(nextWorkingTime).to.be.eql(0);

  });

  it('Shoul be One day on submit next working day', function() {
    const timerInstance = timer.setConfig(timerConfig);

    let formDay = new Date('2019-07-22 06:00:00');
    let toDay = new Date('2019-07-23 06:00:00');

    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "DAYS");
    expect(nextWorkingTime).to.be.eql(1);

  });

  it('should be two days , on submit after working times +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 23:00:00');
    let toDay = new Date('2019-07-23 23:00:00');
    // day.setHours(23,0)
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "DAYS");
    expect(nextWorkingTime).to.be.eql(1);

  });


  
  it('Shoul be One day on submit next working day after working window', function() {
    const timerInstance = timer.setConfig(timerConfig);

    let formDay = new Date('2019-07-22 12:00:00');
    let toDay = new Date('2019-07-23 23:00:00');

    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "DAYS");
    expect(nextWorkingTime).to.be.eql(1);

  });

  
  it('Shoul be two days on submit after tomorrow and it is a working day', function() {
    const timerInstance = timer.setConfig(timerConfig);

    let formDay = new Date('2019-07-22 12:00:00');
    let toDay = new Date('2019-07-24 23:00:00');

    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "DAYS");
    expect(nextWorkingTime).to.be.eql(2);

  });
  


  it('Shoul be zero minutes on submit form and to time before working hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 06:00:00');
    let toDay = new Date('2019-07-22 07:00:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(0);

  });


  it('Shoul be zero minutes on submit form and to time after working hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 22:00:00');
    let toDay = new Date('2019-07-22 23:00:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(0);

  });

  it('Shoul be zero minutes on submit form and to time between shifts', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 14:10:00');
    let toDay = new Date('2019-07-22 15:00:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(0);
  });

  it('Shoul be two minutes on submit form and to time in working hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 09:10:00');
    let toDay = new Date('2019-07-22 09:12:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(2);
  });

  it('Shoul be 600 minutes on submit form before first shift and to time after last shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 06:10:00');
    let toDay = new Date('2019-07-22 23:12:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(600);
  });

  it('Shoul be 960 minutes on submit form before first shift and to time next day after last shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 06:10:00');
    let toDay = new Date('2019-07-23 23:12:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(960);
  });


  it('Shoul be 10 hours on submit form before first shift and to time after last shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 06:10:00');
    let toDay = new Date('2019-07-22 23:12:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "HOURS");
    expect(nextWorkingTime).to.be.eql(10);
  });

  it('Shoul be one hour and half on submit form before first shift and to time after one and half hours form shift start', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-22 06:10:00');
    let toDay = new Date('2019-07-22 09:30:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "HOURS");
    expect(nextWorkingTime).to.be.eql(1.5);
  });


  it('Shoul be three hours and half on submit form date after window before weekend and to date first day after weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-19 23:10:00');
    let toDay = new Date('2019-07-21 11:30:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "HOURS");
    expect(nextWorkingTime).to.be.eql(3.5);
  });


  it('Shoul be minutes hours and half on submit form date after window before weekend and to date first day after weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-19 23:10:00');
    let toDay = new Date('2019-07-21 08:03:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(3);
  });





  it('Shoul be minutes hours and half on submit form date before vacations and to date after vacation', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let formDay = new Date('2019-07-25 23:10:00');
    let toDay = new Date('2019-07-29 08:03:00');
    let nextWorkingTime = timerInstance.workingTimeBetween(formDay, toDay , "MINUTES");
    expect(nextWorkingTime).to.be.eql(3);
  });

});