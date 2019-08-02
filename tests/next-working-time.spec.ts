import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Get Next Working Time Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should be same time, on submit in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);

    expect(nextWorkingTime).to.be.eql(day);

  });

  it('should be next shift start time , on submit before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-25 08:00'));

  });

  it('should be next shift start time , on submit last minute in first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(14,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-25 16:00'));

  });
  

  it('should be next working day first shift , on submit last minute in second shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(20,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 08:00'));

  });

  it('should be after 3 days, on submit time after last shift last day in the week and first day next week is vacation', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(21,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-29 08:00'));

  });


  it('should be next working day first shift , on submit last minute in second shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(20,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-22 08:00'));

  });


  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = 'as' as any;
    return timerInstance.getNextWorkingTimeAsync(day).catch(e =>{
      expect(e.message).to.be.eql('Invalid Date !')
    });
  });


  it('should be next working day first shift , on submit weekend time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(12,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-21 08:00'));

  });

  it('should be next working day first shift , on submit vacation time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05');
    day.setHours(12,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-08-06 08:00'));

  });

  it('should be same time , on submit exceptional working time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(15,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-06-16 15:00'));

  });


  it('should be next shift start time , on submit out of window exceptional working time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(10,0)
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eqls(new Date('2019-06-16 14:00'));

  });


  it('should be same time, on submit in window exceptional working time and day is weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(11,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(day);

  });


  it('should first minute in the window for this day , on submit in window exceptional working time and day is weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-19');
    day.setHours(9,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-19 10:00'));

  });


  it('should be same time, on submit very old date in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-16');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-16 13:00'));

  });



  it('should be next shift start time, on submit very old date before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-16');
    day.setHours(6,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-16 08:00'));

  });

  it('should be same time, on submit far future date in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2023-07-16 13:00'));
  });

  it('should be same time, on submit far future exceptional working date in shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2020-06-16');
    day.setHours(10,30);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2020-06-16 10:30'));
  });

  it('should be next shift start time, on submit far future exceptional working date before shift time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2020-06-16');
    day.setHours(8,30);
    let nextWorkingTime = timerInstance.getNextWorkingTime(day);
    expect(nextWorkingTime).to.be.eql(new Date('2020-06-16 10:00'));
  });


});