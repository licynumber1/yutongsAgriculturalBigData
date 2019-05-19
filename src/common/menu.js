/**
 * powered by 波比小金刚 at 2018-05-07 16:41:38
 * last modified by 波比小金刚 at 2018-05-07 16:41:38
 * @Description: 侧边栏菜单数据
 */
export const menuData = [
  {
    name: '数据可视化',
    icon: 'bar-chart',
    path: '/chart',
    authority: 'map',
    hideInMenu: false,
    children: [
        {
            name: '气象数据',
            path: 'chart/meteorological',
            authority: 'map',
            hideInMenu: false,
            children:[

            ],
        },
        {
            name: '植物生理数据',
            path: 'chart/botany',
            authority: 'map',
            hideInMenu: false,
            children:[
                {
                    name: '玉米',
                    path: '/botany/corn',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '水稻',
                    path: '/botany/rice',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '大豆',
                    path: '/botany/bean',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '其他',
                    path: '/botany/other',
                    authority: 'map',
                    hideInMenu: false,
                },
            ],
        },
        {
            name: '无人机图像数据',
            path: '/uav',
            authority: 'map',
            hideInMenu: false,
            children:[
                {
                    name: '玉米',
                    path: '/uav/corn',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '水稻',
                    path: '/uav/rice',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '大豆',
                    path: '/uav/bean',
                    authority: 'map',
                    hideInMenu: false,
                },
                {
                    name: '其他',
                    path: '/uav/other',
                    authority: 'map',
                    hideInMenu: false,
                },
            ],
        },
    ],
  },
    {
        name: '病害预测',
        icon: 'dot-chart',
        path: '/forecast',
        authority: 'map',
        hideInMenu: false,
        children: [
            {
                name: '玉米',
                path: '/forecast/corn',
                authority: 'map',
                hideInMenu: false,
            },
            {
                name: '水稻',
                path: '/forecast/rice',
                authority: 'map',
                hideInMenu: false,
            },
            {
                name: '大豆',
                path: '/forecast/bean',
                authority: 'map',
                hideInMenu: false,
            },
            {
                name: '其他',
                path: '/forecast/other',
                authority: 'map',
                hideInMenu: false,
            },
        ],
    },
  {
    name: '病害诊断',
    icon: 'search',
    path: '/diagnosis',
    authority: 'map',
    hideInMenu: false,
      children: [
          {
              name: '玉米',
              path: '/diagnosis/corn',
              authority: 'map',
              hideInMenu: false,
          },
          {
              name: '水稻',
              path: '/diagnosis/rice',
              authority: 'map',
              hideInMenu: false,
          },
          {
              name: '大豆',
              path: '/diagnosis/bean',
              authority: 'map',
              hideInMenu: false,
          },
          {
              name: '其他',
              path: '/diagnosis/other',
              authority: 'map',
              hideInMenu: false,
          },
      ],
  },
]
