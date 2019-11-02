import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Get Previous Working Time Test Cases', function() {
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
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eql(day);

  });


  it('should be previous day last shift end time , on submit before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-10-14');
    day.setHours(6,0)
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-10-13 20:00'));

  });


  it('should be previous shift end time , on submit between shifts', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-10-14 15:00:00');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-10-14 14:00'));

  });

  it('should be last week day last shift end time , on submit weekend date time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-10-19 11:00');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-10-17 20:00'));

  });


  it('should be last week day last shift end time , on submit first week day before first shift', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-10-20 06:00');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-10-17 20:00'));

  });


  it('should be before 3 days, on submit time before first after weekend and vacation day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-29 06:00');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-07-25 20:00'));

  });


  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = 'as' as any;
    return timerInstance.getPreviousWorkingTimeAsync(day).catch(e =>{
      expect(e.message).to.be.eql('Invalid Date !')
    });
  });


  it('should be same time on submit exceptiona working time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-06-16 15:30');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-06-16 15:30'));

  });


  it('should be same time on submit before exceptiona working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-14 06:30');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-08-13 12:00'));

  });


  it('should be previous working day last shift , on submit vacation time', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05 12:00');
    let previousWorkingTime = timerInstance.getPreviousWorkingTime(day);
    expect(previousWorkingTime).to.be.eqls(new Date('2019-08-04 20:00'));

  });

});