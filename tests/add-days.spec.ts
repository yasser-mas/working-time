import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Add Days Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should next day first window, on submit in shift time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-23 08:00'));

  });

  it('should be after tomorrow, on submit in shift time +2 DAYS', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 2 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-24 08:00'));

  });
  
  it('should next day first window , on submit before first shift +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(6,0)
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-23 08:00'));

  });

  it('should be after two days , on submit after working times +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(23,0)
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-24 08:00'));

  });


  it('should be after two days , on submit last minute in second shift +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-21');
    day.setHours(20,0)
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-23 08:00'));

  });

  it('should be after 4 days, on submit time after last shift last day in the week and first day next week is vacation +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(21,0)
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-07-30 08:00'));

  });

  it('should be after 6 days, on submit time after last shift last day in the week and first day next week is vacation +3 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    day.setHours(21,0)
    let nextWorkingTime = timerInstance.add(day, 3 , "DAYS");
    expect(nextWorkingTime).to.be.eqls(new Date('2019-08-01 08:00'));

  });


  it('should next day first window, on submit between shifts time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-22');
    day.setHours(15,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-23 08:00'));

  });

  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = 'as' as any;
    return timerInstance.addAsync(day, 1 , "DAYS").catch(e =>{
      expect(e.message).to.be.eql('Invalid Date !')
    });
  });

  it('should be after two days, on submit weekend time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-20');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-22 08:00'));

  });

  it('should be after two days, on submit vacation time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-08-07 08:00'));

  });

  it('should be next day, on submit exceptional working time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(15,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-17 08:00'));

  });

  it('should be next exceptional day first exceptional time, on submit before exceptional day in working time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-12');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-08-13 10:00'));

  });

  it('should be after two days, on submit after exceptional working time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16');
    day.setHours(23,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-06-18 08:00'));

  });



  it('should count exceptional working day, on submit before exceptional working day and day is weekend +1 Day ', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-18');
    day.setHours(10,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2019-07-19 10:00'));

  });

  it('should be next day, on submit very old date in shift time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-15');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-16 08:00'));

  });

  it('should be next day, on submit very old date before first shift +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-15');
    day.setHours(6,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-16 08:00'));

  });

  it('should be after three days, on submit very old date last day of working days +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2016-06-16');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2016-06-19 08:00'));

  });


  it('should be next day, on submit far future date in shift time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(13,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2023-07-17 08:00'));

  });

  it('should be after two days, on submit far future date after shift time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2023-07-16');
    day.setHours(23,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2023-07-18 08:00'));

  });


  it('should be next exceptional day first exceptional time, on submit before exceptional day in working time +1 DAY', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2020-06-15');
    day.setHours(12,0);
    let nextWorkingTime = timerInstance.add(day, 1 , "DAYS");
    expect(nextWorkingTime).to.be.eql(new Date('2020-06-16 10:00'));

  });


});