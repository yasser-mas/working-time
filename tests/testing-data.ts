export const VALID_TIMER_CONFIG = {
    vacations: ['2019-06-26' , '2019-06-27','2019-07-28', '2019-08-05'],
    normalWorkingHours: {
      0: [
        {
          // Sunday
          from: '08:00',
          to: '14:00'
        },{
          from: '16:00',
          to: '20:00'
        }
      ],
      1: [
        {
          from: '08:00',
          to: '14:00'
        },{
          from: '16:00',
          to: '20:00'
        }
      ],
      2: [
        {
          from: '08:00',
          to: '14:00'
        }
      ],
      3: [
        {
          from: '08:00',
          to: '14:00'
        }
      ],
      4: [
        {
          from: '08:00',
          to: '14:00'
        },{
          from: '16:00',
          to: '20:00'
        }
      ]
    },
    exceptionalWorkingHours: {
      '2019-06-16': [
        {
          from: '14:00',
          to: '20:00'
        }
      ],
      '2019-06-26': [
        {
          from: '12:15',
          to: '16:00'
        }
      ],
      '2019-08-13': [
        {
          from: '10:00',
          to: '12:00'
        }
      ],
      '2020-06-16': [
        {
          from: '10:00',
          to: '12:00'
        }
      ]
    },
    minBufferedDays: 6,
    maxBufferedDays: 8
  }