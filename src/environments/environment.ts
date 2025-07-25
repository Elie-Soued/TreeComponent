import { type environment_type } from '../app/types';

export const environment: environment_type = {
  production: false,
  BASE_URL:
    'http://192.168.1.254/ogs_php/ogs_menu_webclient/index.php?nav=menu.load&_dc=1753169807332&ajax_req=%7B%22language%22%3A%220%22%2C%22MenuUsername%22%3A%22SOUEID%22%2C%22menu%22%3A%22R10ALL00%22%2C%22DataBase%22%3A%22OGSTCPDB%22%2C%22DataLib%22%3A%22OGS01R10%22%7D&node=root',
  FAVORITE_URL: 'http://192.168.1.254/ogs_php/ogs_menu_webclient/index.php?nav=menu.save',

  favorite_payload: {
    language: '0',
    MenuUsername: 'SOUEID',
    menu: 'R10ALL00',
    DataBase: 'OGSTCPDB',
    DataLib: 'OGS01R10',
    favorites: {
      text: 'Favoriten',
      iconCls: 'no-icon',
      children: [
        {
          text: 'Kundenstamm',
          iconCls: 'prosoz_16.ico',
          call: 'R10ST00001',
        },
      ],
    },
  },
};
