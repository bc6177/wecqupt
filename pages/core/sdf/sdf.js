//sdf.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    userName: '',
    renderData: {}
  },

  onLoad: function(){
    var _this = this;
    if(!app._user.xs.xm || !app._user.xs.xh){
      _this.setData({
        remind: '未绑定帐号'
      });
      return false;
    }
    if(!app._user.xs.room || !app._user.xs.build){
      _this.setData({
        remind: '未完善寝室信息'
      });
      return false;
    }
    _this.setData({
      userName: app._user.xs.xm,
      userYkth: app._user.xs.ykth,
    });
    // 发送请求
    wx.request({
      url: app._server + '/api/get_elec.php', 
      data: {
        buildingNo: app._user.xs.build,
        floor: app._user.xs.room.slice(0,1),
        room: parseInt(app._user.xs.room.slice(1))
      },
      success: function(res) {
        if(res.data.status == 200){
          var info = res.data.data;
          _this.setData({
            'renderData': info,
            'renderData.room_name': info.room.split('-').join('栋'),
            'renderData.last_time': info.record_time.split(' ')[0],
            remind: ''
          });
        }else{
          app.showErrorModal(res.data.message);
          _this.setData({
            remind: res.data.message || '未知错误'
          });
        }
      },
      fail: function(res) {
        app.showErrorModal(res.errMsg);
        _this.setData({
          remind: '网络错误'
        });
      }
    });
  }
});