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


  it('should be next day first shift, on submit in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-24');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-25 08:00'));

  });

  it('should be after 3 days , on submit in shift time last day of week and first day of week is vacation', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);

    expect(nextWorkingTime).to.be.eql(new Date('2019-07-29 08:00'));

  });

  it('should be next day first shift start time , on submit before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-23');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-24 08:00'));

  });

  it('should be next working day first shift , on submit last minute in second shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(20,0)
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 08:00'));

  });


  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = 'as' as any;
    return timerInstance.getNextWorkingDayAsync(day).catch(e =>{
      expect(e.message).to.be.eql('Invalid Date !')
    });
  });

  it('should be next working day first shift , on submit weekend time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(12,0)
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-21 08:00'));

  });

  it('should be next working day first shift , on submit vacation time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05');
    day.setHours(12,0)
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-08-06 08:00'));

  });


  it('should be next day first shift start time , on submit day before exceptional working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-15');
    day.setHours(10,0)
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-06-16 14:00'));

  });


  it('should be next day , on submit day before weekend and weekend day is exceptional working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-18');
    day.setHours(11,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-19 10:00'));

  });


  it('should be next week first working day, on submit exceptional working weekend day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(11,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-21 08:00'));

  });

  it('should be next day, on submit very old date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-14');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-15 08:00'));

  });


  it('should be same time, on submit far future date in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.getNextWorkingDay(day);
    expect(nextWorkingTime).to.be.eql(new Date('2023-07-17 08:00'));
  });

});