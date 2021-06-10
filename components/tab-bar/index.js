// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: String,
      value: "index"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navs: [{
      icon: "wap-home-o",
      page: "../../pages/index/index",
      label: "首页",
      name: "index"
    },
    {
      icon: "notes-o",
      page: "../../pages/statistics/index",
      label: "统计",
      name: "statistics"
    },
    {
      icon: "manager-o",
      page: "../../pages/user/index",
      label: "我的",
      name: "user"
    }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      let url;
      this.data.navs.forEach(item => {
        if (item.name == event.detail) {
          url = item.page
        }
      })
      wx.redirectTo({ url: url })
    }
  }
})
