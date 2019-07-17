import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import TimerError from '../source/lib/timer-error';
import { BusinessDay } from '../source/lib/interfaces/i-business-day';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Initiate Timer Builder', function() {
  /*  let timer : Timer ;

  
  before(function() {
    timer = TimerFactory.getTimerInstance();
  }); */

  it('should initiate timer builder', function() {
    let timer = TimerFactory.getTimerInstance();

    expect(timer).not.null;
  });

  it('new timer should be same instance', function() {
    let timer = TimerFactory.getTimerInstance();
    let timer2 = TimerFactory.getTimerInstance();
    expect(timer).to.be.equal(timer2);
  });

  it('all instances should have same configuration', function() {
    let timer = TimerFactory.getTimerInstance();
    timer.setConfig(VALID_TIMER_CONFIG);
    let timer2 = TimerFactory.getTimerInstance();
    expect(timer.getBufferedCalender).equal(timer2.getBufferedCalender);
  });


  it('should initiate timer with empty vacations', function() {
    let timer = TimerFactory.getTimerInstance();
    let invalidConfig = getCopy(VALID_TIMER_CONFIG);
    invalidConfig.vacations = [];
    expect(timer.setConfig(invalidConfig)).to.not.be.null;

  });

  it('should throw exception on create timer with invalid vacation ', function() {
    let timer = TimerFactory.getTimerInstance();
    let invalidConfig = getCopy(VALID_TIMER_CONFIG);
    invalidConfig.vacations = [ "asd" ];
    expect(()=> timer.setConfig(invalidConfig)).to.throw('Invalid Vacation Date !');
  });


  it('should throw exception on initiate timer with invalid working days', function() {
    let timer = TimerFactory.getTimerInstance();
    let invalidConfig = getCopy(VALID_TIMER_CONFIG);
    invalidConfig.normalWorkingHours[0] = [
      {
        from: 'ww:15',
        to: '14:00'
      }
    ];
    expect(()=> timer.setConfig(invalidConfig)).to.throw('Invalid Working Hours => Time should be hh:mm !');
  });


  it('should throw exception on initiate timer with empty working days', function() {
    let timer = TimerFactory.getTimerInstance();
    let invalidConfig = getCopy(VALID_TIMER_CONFIG);
    invalidConfig.normalWorkingHours = {};
    // console.log(timer.setConfig(invalidConfig));
    expect(()=> timer.setConfig(invalidConfig)).to.throw('You should provide at least one working day !');

  });
});
