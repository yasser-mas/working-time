import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Is Working Time Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should be working time, on submit time in the last shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(12,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });


  it('should be working time, on submit first minute in first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(8,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });


  it('should not be working time, on submit last minute in first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(20,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });


  it('should be working time secound shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(17,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });

  it('should not be working time, between two shifts', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(15,30)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });

  it('should not be working time, before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(6,30)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });

  it('should not be working time, after all shifts', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(23,30)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });

  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = '2019-07-25' as any ;
    return timerInstance.isWorkingTimeAsync(day).catch(e =>{
        expect(e.message).to.be.eql('Invalid Date !')
    });
  });



  it('should not be working time, on submit weekend day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-26');
    day.setHours(12,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });


  it('should not be working time, on submit vacation day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05');
    day.setHours(12,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });
  

  it('should be working time, on submit in window exceptional working hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(15,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });

  it('should not be working time, on submit out of window exceptional working hours', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(12,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });



  it('should be working time, on submit in window exceptional working hours and day is weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(11,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });


  it('should be working time, on submit in window very old date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-16');
    day.setHours(13,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });
  

  it('should be working time, on submit in window far future date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(13,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });
  

  it('should be working time, on submit in window far future exceptional working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2020-06-16');
    day.setHours(10,30)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.true;

  });
  
  it('should not be working time, on submit out of window far future date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(6,0)
    let isWorkingTime = timerInstance.isWorkingTime(day);
    expect(isWorkingTime).to.be.false;

  });
  

});
