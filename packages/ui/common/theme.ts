const theme = {
  extend: {
    keyframes: {
      shrink: {
        from: { transform: 'scaleX(1)' },
        to: { transform: 'scaleX(0)' },
      },
    },
    animation: {
      shrink: 'shrink 300ms ease-out forwards',
    },
    backgroundImage: {},
  },

  fontFamily: {
    ubuntu: ['Ubuntu', 'sans-serif'],
  },
  fontSize: {
    h1: '24px',
    h2: '22px',
    h3: '20px',
    caption: '14px',
    body: '16px',
    smallText: '12px',
    textXs: '10px',
  },
  colors: {
    base: '#222222',
    deep: '#181818',

    surface: {
      100: '#2A2A2A',
      200: '#333333',
      300: '#202020',
      400: '#1e1e1e',
      modal: '#2E2E2E',
      drawer: '#242424',
      popover: '#2D2D2D',
    },

    border: {
      subtle: '#303030',
      strong: '#474747',
      modal: '#3F3F3F',
      drawer: '#373737',
      popover: '#424242',
    },

    text: {
      primary: '#FFFFFF',
      secondary: '#C9C9C9',
      muted: '#9A9A9A',
      disabled: '#6D6D6D',
      inverse: '#000000',
    },

    accent: {
      blue: '#4DA3FF',
      purple: '#B58AFF',
      green: '#58D39B',
      orange: '#FFAE57',
      pink: '#FF7FAE',
      red: '#E45C5C',
    },

    status: {
      success: '#4CAF50',
      warning: '#F0C24D',
      error: '#E54848',
      info: '#52A8FF',
    },

    button: {
      primary: {
        background: '#2E2E2E',
        hover: '#3A3A3A',
        active: '#242424',
        text: '#FFFFFF',
      },
      secondary: {
        background: '#333333',
        hover: '#3D3D3D',
        active: '#292929',
        text: '#FFFFFF',
      },
    },

    notification: {
      success: {
        accent: '#58D39B',
        bg: '#58D39B22',
        border: '#58D39B44',
      },
      error: {
        accent: '#E45C5C',
        bg: '#E45C5C22',
        border: '#E45C5C44',
      },
      warning: {
        accent: '#FFAE57',
        bg: '#FFAE5722',
        border: '#FFAE5744',
      },
      info: {
        accent: '#4DA3FF',
        bg: '#4DA3FF22',
        border: '#4DA3FF44',
      },
      neutral: {
        accent: '#474747',
        bg: '#2A2A2A',
        border: '#303030',
      },
    },

    transparent: 'transparent',
  },

  borderRadius: {
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    9: '9px',
    10: '10px',
    12: '12px',
    14: '14px',
    16: '16px',
    17: '17px',
    18: '18px',
    20: '20px',
    24: '24px',
    100: '100px',
    full: '100px',
  },
  spacing: {
    0: '0px',
    1: '1px',
    2: '2px',
    3: '3px',
    4: '4px',
    5: '5px',
    6: '6px',
    7: '7px',
    8: '8px',
    9: '9px',
    10: '10px',
    11: '11px',
    12: '12px',
    13: '13px',
    14: '14px',
    16: '16px',
    18: '18px',
    24: '24px',
    30: '30px',
    32: '32px',
    40: '40px',
    48: '48px',
    64: '64px',
    80: '80px',
    96: '96px',
    auto: 'auto',
  },
}

module.exports = theme
