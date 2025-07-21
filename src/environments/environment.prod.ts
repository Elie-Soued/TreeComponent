export const environment = {
  production: true,
  URL: 'http://192.168.1.254/ogs_php/ogs_menu_webclient/index.php?nav=menu.save',
  ajax_req: {
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
