import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Set Working Timeout Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;
   let cb = function (){
     return 1;
   } ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });


  it('should set timeout after one minute from given date ', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2020-08-20');
    day.setHours(10,0);
    let cb2 = function(){
      return 2 ;
    }
    let timeout = timerInstance.setWorkingTimeout(day, 1 , 'MINUTES',cb , 'Timeout for confirm order');
    expect(timeout.fireDate).to.be.eql(new Date('2020-08-20 10:01'));
    expect(timeout.baseDate).to.be.eql(day);
    expect(timeout.description).to.be.eql('Timeout for confirm order');
    expect(timeout.fired).to.be.eql(false);
    expect(timeout.timeUnit).to.be.eql('MINUTES');
    
    // expect(timeout.remainingTime).to.be.eql( new Date('2020-08-20 10:01').getTime() - Date.now());

    expect(timeout.callback()).to.be.eql( 1 );
    timeout.callback = cb2;
    expect(timeout.callback()).to.be.eql( 2 );
    expect(timeout.cancelled).to.be.eql( false );
    timeout.clearTimeout();// To close test
    expect(timeout.cancelled).to.be.eql( true );

  });


  it('should set timeout soonest working day first window, on submit old date and will fire in the past', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-10');
    day.setHours(12,0);
    let timeout = timerInstance.setWorkingTimeout(day, 1 , 'DAYS',cb , 'Timeout for confirm order');
    expect(timeout.fireDate).to.be.eql(timer.getNextWorkingTime(new Date()));
    // expect(timeout.remainingTime).to.be.eql( timer.getNextWorkingTime(new Date()).getTime() - Date.now());
    expect(timeout.callback()).to.be.eql( 1 );
    expect(timeout.fired).to.be.eql( false );
    timeout.clearTimeout();// To close test
  });


  it('should set timeout soonest working day first window, on submit old date and will fire in the past', function() {
    const timerInstance = timer.setConfig(timerConfig);
    let day = new Date('2019-07-10');
    day.setHours(12,0);
    timerInstance.setWorkingTimeoutAsync(day , 1 , 'DAYS',cb , 'Timeout for confirm order').then( timeout =>{
      expect(timeout.fireDate).to.be.eql(timer.getNextWorkingTime(new Date()));
      expect(timeout.callback()).to.be.eql( 1 );
      expect(timeout.fired).to.be.eql( false );
      timeout.clearTimeout();// To close test    })
    });
  });

});