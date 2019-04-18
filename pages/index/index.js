  //index.js
//获取应用实例
const app = getApp();
const jinrishici = require('../../utils/jinrishici.js');
const { $Message } = require('../../dist/base/index');
const request = require('../../utils/request.js');


Page({
    /**
     * 页面的初始数据
     */
    data: {
        spinShow: true,
        Author: "WeHalo",
        Num: 5,
        pageNum: 0,
        Flag: 0,
        loadMore: false,
        loadMores: false,
        blogName: app.globalData.blogName,
        aflag: true,
        scrollTop: 0,
        nav: true,
        page: 1,
        limit: 5,
        posts: []
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {

        // wx.showNavigationBarLoading() //在标题栏中显示加载
        var that = this; //不要漏了这句，很重要
        var url = app.globalData.URL + '/api/archives/all';
        var userAvatarUrl = app.globalData.URL;
        var token = app.globalData.TOKEN;
        var params = {};
        //@todo 网络请求API数据
        request.requestGetApi(url, token, params, this, this.successFunRefreshPosts, this.failFunRefreshPosts);

        jinrishici.load(result => {
            // 下面是处理逻辑示例
            this.setData({
                "jinrishici": result.data.content,
                shici: result.data.origin.content,
            })
            //关闭下拉刷新
            wx.stopPullDownRefresh();
        })

    },

    /**
     * 事件处理函数
     */
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.app = getApp();
        var that = this; //不要漏了这句，很重要
        var url = app.globalData.URL + '/wechat/page/' + this.data.page;
        var userAvatarUrl = app.globalData.URL;
        var token = app.globalData.TOKEN;
        var params = {};
        //@todo 网络请求API数据
        
        this.setData({"spinShow":"true"});
        $Message({
          content: '加载中~。',
          duration: 2
        });
        request.requestGetApi(url, token, params, this, this.successFunPosts, this.failFunPosts);

        //微信自带Loading效果
        // wx.showLoading({
        //   title: '加载中',
        // })

        jinrishici.load(result => {
            // 下面是处理逻辑示例
            this.setData({
                "jinrishici": result.data.content,
                shici: result.data.origin.content,
            })
        });



    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: app.globalData.blogName
        }
    },

    /**
     * 加载更多
     */
    onReachBottom: function () {
        this.app = getApp();
        var that = this; //不要漏了这句，很重要
        var url = app.globalData.URL + '/wechat/page/' + this.data.page;
        var userAvatarUrl = app.globalData.URL;
        var token = app.globalData.TOKEN;
        var params = {};
        //@todo 网络请求API数据
        this.setData({ "spinShow": true, "loadMore": true, "Author": "加载中"});
        $Message({
          content: '加载中~。',
          duration: 2
        });
        request.requestGetApi(url, token, params, this, this.successFunPosts, this.failFunPosts);

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.showPost();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // this.closePost();
    },

    handleQrcode() {
        wx.previewImage({
            urls: ['https://blog.eunji.cn/upload/2018/11/wx20181208174737572.png']
        })
    },

    /**
     * 防止冒泡
     */
    prevent() {
        console.log("防止冒泡");
        var self = this;
        wx.setClipboardData({
            data: "https://github.com/aquanlerou"
        });

    },

    showMask() {
        this.setData({
            aflag: false,
        });
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 0
        });
        animation.opacity(1).translate(wx.getSystemInfoSync().windowWidth, 0).step()
        this.setData({
            ani: animation.export()
        })
    },

    closeMask() {

        var that = this;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 0
        });
        animation.opacity(0).translate(-wx.getSystemInfoSync().windowWidth, 0).step()
        that.setData({
            ani: animation.export()
        });

        setTimeout(function () {
            that.setData({
                aflag: true,
            });
        }, 600);
    },

    /**
     * Post淡入效果
     */
    showPost() {
        var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
            delay: 0
        });
        animation.opacity(1).step();
        this.setData({
            anp: animation.export()
        })
    },

    /**
     * Post淡出效果
     */
    closePost() {
        console.log("closePost");
        var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
            delay: 0
        });
        animation.opacity(0).step();
        this.setData({
            anp: animation.export()
        })
    },

    /**
     * 监听屏幕滚动 判断上下滚动
     */
    onPageScroll: function (event) {
        var that = this;
        if (event.scrollTop > 100) {
            that.setData({
                nav: false
            });
        } else {
            that.setData({
                nav: true
            });
        }
    },

    /**
     * 首頁文章列表请求--接口调用成功处理
     */
    successFunPosts: function (res, selfObj) {
        var that = this;
        var data = res.list;
      
        if (data) {
          $Message({
            content: '加载成功~。',
            duration: 2
          });
          var posts = this.data.posts;
          posts.push.apply(posts, data);
          that.setData({
            spinShow: false,
            userAvatar: "https://liuzihua.top/user/img/avatar/mine.jpg",
            posts: posts,
            imageUrl: app.globalData.URL + "/user/img/rand/"
          })
        }else {
          $Message({
            content: '博主已经努力了，会坚持不定时更新的~。',
            duration: 2
          });
          this.setData({
            'loadMore': false,
            'Author': '加载完',
            'loadMores': false,
          })
        }


        this.setData({
          "page" : this.data.page + 1,
          "spinShow" : false
        });
    
        //淡入动画效果
        that.showPost();
        // selfObj.setData({
        //     resultData: res.result[0].posts,
        // })
    },

    /**
     * 首頁文章列表请求--接口调用失败处理
     */
    failFunPosts: function (res, selfObj) {
        console.log('failFunPosts', res)
    },

    /**
     * 首頁文章列表下拉刷新请求--接口调用成功处理
     */
    successFunRefreshPosts: function (res, selfObj) {
        var that = this;
        var posts_list = [];
        var count = res.result[0].count;
        var userAvatarUrl = app.globalData.URL;
        if (count < 5) {
            for (var i = 0; i < count; i++) {
                posts_list.push(res.result[0].posts[i]);
            }
        } else {
            for (var i = 0; i < 5; i++) {
                posts_list.push(res.result[0].posts[i]);
            }
        };
        that.setData({
            spinShow: false,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
            userName: res.result[0].posts[0].user.userDisplayName,
            userAvatar: userAvatarUrl + res.result[0].posts[0].user.userAvatar,
            posts: posts_list,
            //加载更多数据归零
            pageNum: 0,
            Flag: 0,
            loadMores: false,
        });
    },

    /**
     * 首頁文章下拉刷新请求--接口调用失败处理
     */
    failFunRefreshPosts: function (res, selfObj) {
        console.log('failFunRefreshPosts', res)
    },


})