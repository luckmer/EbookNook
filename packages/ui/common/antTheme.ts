import { ThemeConfig } from 'antd'

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#52c41a',
    borderRadius: 8,
    fontSize: 16,
  },
  components: {
    Drawer: {
      colorBgElevated: '#111A1F',
      colorBgMask: 'rgba(0, 0, 0, 0.65)',
      colorText: '#fff',
      colorIcon: '#CFD7D7',
      colorIconHover: '#fff',
    },
    Modal: {
      colorBgElevated: '#111A1F',
      colorText: '#fff',
      colorIcon: '#CFD7D7',
      colorIconHover: '#fff',
    },
    Segmented: {
      colorBgLayout: 'transparent',
      colorBgContainer: 'transparent',

      itemColor: '#CFD7D7',
      itemHoverColor: '#fff',
      itemSelectedColor: '#fff',

      itemHoverBg: '#152a31',
      itemActiveBg: '#152a31',
      itemSelectedBg: '#152a31',

      colorIcon: '#CFD7D7',
      colorIconHover: '#fff',
    },
  },
}
