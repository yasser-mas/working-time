import { expect, should, assert } from 'chai';
import TimerFactory from '../source/index';
import { Timer } from '../source/lib/timer';
import { VALID_TIMER_CONFIG } from './testing-data';
import { ITimerParams } from '../source/lib/interfaces/i-timer-params';


function getCopy(obj: ITimerParams ):ITimerParams{
  return (JSON.parse(JSON.stringify(obj)));
}


describe('Initiate Timer Test Cases', function() {
   let timer : Timer ;
   let timerConfig : ITimerParams ;

  
  beforeEach(function() {
    TimerFactory.clearTimer();
    timer = TimerFactory.getTimerInstance();
    timerConfig = getCopy(VALID_TIMER_CONFIG);
  });

  it('should initiate timer', function() {
    expect(timer).not.null;
  });

  it('new timer should be same instance', function() {
    let timer2 = TimerFactory.getTimerInstance();
    expect(timer).to.be.equal(timer2);
  });

  it('all instances should have same configuration', function() {
    timer.setConfig(timerConfig);
    let timer2 = TimerFactory.getTimerInstance();
    expect(timer.getBufferedCalendar).equal(timer2.getBufferedCalendar);
  });




  /**
   *  Test cases for vacations configuration 
   */

  it('should initiate timer with empty vacations', function() {
    timerConfig.vacations = [];
    expect(timer.setConfig(timerConfig)).to.not.be.null;

  });

  it('should throw exception on set config with invalid vacation ', function() {
    timerConfig.vacations = [ "asd" ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.include('Invalid Vacation Date "asd" !');
    });
  });




  /**
   *  Test cases for normal working hours configuration 
   */
  

  it('should throw exception on set config with invalid normal working hours', function() {
    timerConfig.normalWorkingHours[0] = [
      {
        from: 'ww:15',
        to: '14:00'
      }
    ];
    // expect(()=> timer.setConfig(invalidConfig)).to.throw('Invalid Working Hours => Time should be hh:mm !');
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Hours "From: ww:15 To: 14:00" => Time should be hh:mm !');
    });
  });


  it('should throw exception on set config with empty working days', function() {
    timerConfig.normalWorkingHours = {};
    // expect(()=> timer.setConfig(invalidConfig)).to.throw('You should provide at least one working day !');
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('You should provide at least one working day !');
    });
  });


  it('should throw exception on set config with working day greater than 6', function() {
    timerConfig.normalWorkingHours[8] = [
      {
        from: '10:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Day "8" => Day should be from 0 to 6 !');
    });
  });


  it('should throw exception on set config with empty string working day', function() {
    timerConfig.normalWorkingHours['' as any] = [
      {
        from: '10:15',
        to: '14:00'
      }
    ];
    // expect(()=> timer.setConfig(invalidConfig)).to.throw('You should provide at least one working day !');
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Day "" => Day should be from 0 to 6 !');
    });
  });

  it('should throw exception on set config with working hours from greater than to ', function() {
    timerConfig.normalWorkingHours[5] = [
      {
        from: '16:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Hours "From: 16:15 To: 14:00" => To should be greater than from !');
    });
  });



  it('should throw exception on set config with empty from time ', function() {
    timerConfig.normalWorkingHours[5] = [
      {
        from: '',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Hours "From:  To: 14:00" => Time should be hh:mm !');
    });
  });



  it('should throw exception on set config with empty working hours', function() {
    timerConfig.normalWorkingHours[5] = [
      
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Day "5" => Day should contain one working minute at least !');
    });
  });



  it('should throw exception on set config with empty working hours', function() {
    timerConfig.normalWorkingHours[5] = [
      
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Working Day "5" => Day should contain one working minute at least !');
    });
  });





  /**
   *  Test cases for exceptional working hours configuration 
   */
  


  it('should throw exception on set config with invalid exceptional working hours', function() {
    timerConfig.exceptionalWorkingHours['2019-06-16'] = [
      {
        from: 'ww:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Working Hours "From: ww:15 To: 14:00" => Time should be hh:mm !');
    });
  });


  it('should set config with empty exceptional working days', function() {
    timerConfig.exceptionalWorkingHours = {};
    expect(timer.setConfig(timerConfig)).to.not.throw;
  });



  it('should throw exception on set config with invalid exceptional working day format', function() {
    timerConfig.exceptionalWorkingHours['12-sd' as any] = [
      {
        from: '10:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Date "12-sd" !');
    });
  });

  it('should throw exception on set config with empty string exceptional working day', function() {
    timerConfig.exceptionalWorkingHours['' as any] = [
      {
        from: '10:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Date "" !');
    });
  });


  it('should throw exception on set config with exceptional working hours from greater than to ', function() {
    timerConfig.exceptionalWorkingHours['2019-06-16'] = [
      {
        from: '16:15',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Working Hours "From: 16:15 To: 14:00" => To should be greater than from !');
    });
  });


  it('should throw exception on set config with empty from time ', function() {
    timerConfig.exceptionalWorkingHours['2019-06-16'] = [
      {
        from: '',
        to: '14:00'
      }
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Working Hours "From:  To: 14:00" => Time should be hh:mm !');
    });
  });

  it('should throw exception on set config with empty exceptional working hours', function() {
    timerConfig.exceptionalWorkingHours['2019-06-16'] = [
      
    ];
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Exceptional Working Day "2019-06-16" => Day should contain one working minute at least !')
    });
  });


  /**
   * Test cases for min and max buffered days
   */

  

  it('should throw exception on set config with invalid min buffered days', function() {
    timerConfig.minBufferedDays = 'asd' as any;
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Minimum Buffered Days => Should be number !')
    });
  });


  it('should throw exception on set config with invalid max buffered days', function() {
    timerConfig.maxBufferedDays = 'asd' as any;
    return timer.setConfigAsync(timerConfig).catch(e=>{
      expect(e.message).to.be.eq('Invalid Maximum Buffered Days => Should be number !')
    });
  });


});
