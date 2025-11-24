import { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#58D39B',
    colorBgBase: '#222222',
    colorBgContainer: '#2A2A2A',
    colorBgElevated: '#181818',
    colorBorder: '#303030',
    borderRadius: 8,
    fontSize: 16,
    colorTextBase: '#FFFFFF',
    colorTextSecondary: '#C9C9C9',
    colorTextDisabled: '#6D6D6D',
  },
  components: {
    Drawer: {
      colorBgElevated: '#181818',
      colorBgMask: 'rgba(0, 0, 0, 0.65)',
      colorText: '#FFFFFF',
      colorIcon: '#C9C9C9',

      colorIconHover: '#FFFFFF',
    },
    Modal: {
      colorBgElevated: '#181818',
      colorText: '#FFFFFF',
      colorIcon: '#C9C9C9',
      colorIconHover: '#FFFFFF',
    },
    Segmented: {
      colorBgLayout: 'transparent',
      colorBgContainer: 'transparent',

      itemColor: '#C9C9C9',
      itemHoverColor: '#FFFFFF',
      itemSelectedColor: '#FFFFFF',

      itemHoverBg: '#242424',
      itemActiveBg: '#242424',
      itemSelectedBg: '#242424',

      colorIcon: '#C9C9C9',
      colorIconHover: '#FFFFFF',
    },
    Button: {
      colorBgContainer: '#2A2A2A',
      colorBgElevated: '#181818',
      colorPrimary: '#58D39B',
      colorText: '#FFFFFF',
    },
    Input: {
      colorBgContainer: '#2A2A2A',
      colorBorder: '#303030',
      colorText: '#FFFFFF',
      colorTextPlaceholder: '#9A9A9A',
    },
    Popover: {
      colorBgElevated: '#2D2D2D',
      colorBorder: '#424242',
      colorText: '#FFFFFF',
    },
  },
}
