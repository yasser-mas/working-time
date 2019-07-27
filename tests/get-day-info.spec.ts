import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Get Day Info Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should be normal working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-25');
    let dayInfo = timerInstance.getDayInfo(day);
    expect(dayInfo.isExceptional).to.be.false;
    expect(dayInfo.isVacation).to.be.false;
    expect(dayInfo.isWeekend).to.be.false;
    expect(dayInfo.workingHours).to.be.eql(timerConfig.normalWorkingHours[4]);

  });


  it('should throw exception on submit invalid date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = '2019-07-25' as any ;

    return timerInstance.getDayInfoAsync(day).catch(e =>{
        expect(e.message).to.be.eql('Invalid Date !')
    });
  });

  it('should throw exception on submit nullable date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = null as any ;
    return timerInstance.getDayInfoAsync(day).catch(e =>{
        expect(e.message).to.be.eql('Invalid Date !')
    });
  });

  it('should be weekend', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-26');
    let dayInfo = timerInstance.getDayInfo(day);

    expect(dayInfo.isExceptional).to.be.false;
    expect(dayInfo.isVacation).to.be.false;
    expect(dayInfo.isWeekend).to.be.true;
    expect(dayInfo.workingHours).to.be.eql([]);

  });


  it('should be vacation', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-05');
    let dayInfo = timerInstance.getDayInfo(day);

    expect(dayInfo.isExceptional).to.be.false;
    expect(dayInfo.isVacation).to.be.true;
    expect(dayInfo.isWeekend).to.be.false;

  });


  it('should be exceptional working day', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-08-13');
    let dayInfo = timerInstance.getDayInfo(day);

    expect(dayInfo.isExceptional).to.be.true;
    expect(dayInfo.isVacation).to.be.false;
    expect(dayInfo.isWeekend).to.be.false;
    expect(dayInfo.workingHours).to.be.eql(timerConfig.exceptionalWorkingHours['2019-08-13']);

  });


  it('should extend buffered calendar on sbumit very old date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2017-03-22');
    let dayInfo = timerInstance.getDayInfo(day);
    expect(dayInfo.isExceptional).to.be.false;
    expect(dayInfo.isVacation).to.be.false;
    expect(dayInfo.isWeekend).to.be.false;
    expect(dayInfo.workingHours).to.be.eql(timerConfig.normalWorkingHours[3]);

  });


  it('should extend buffered calendar on sbumit far future date', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2022-05-22');
    let dayInfo = timerInstance.getDayInfo(day);
    expect(dayInfo.isExceptional).to.be.false;
    expect(dayInfo.isVacation).to.be.false;
    expect(dayInfo.isWeekend).to.be.false;
    expect(dayInfo.workingHours).to.be.eql(timerConfig.normalWorkingHours[0]);

  });




});
