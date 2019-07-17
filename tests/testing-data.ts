export const VALID_TIMER_CONFIG = {
    vacations: ['2019-06-26'],
    normalWorkingHours: {
      0: [
        {
          // Sunday
          from: '08:15',
          to: '14:00'
        }
      ],
      1: [
        {
          from: '08:15',
          to: '14:00'
        }
      ],
      2: [
        {
          from: '08:15',
          to: '14:00'
        }
      ],
      3: [
        {
          from: '08:15',
          to: '14:00'
        }
      ],
      4: [
        {
          from: '08:15',
          to: '14:00'
        }
      ]
    },
    exceptionalWorkingHours: {
      '2019-06-16': [
        {
          from: '12:15',
          to: '16:00'
        }
      ],
      '2019-06-26': [
        {
          from: '12:15',
          to: '16:00'
        }
      ]
    },
    minBufferedDays: 6,
    maxBufferedDays: 8
  }