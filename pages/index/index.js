Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    current: '',
    current_scroll: '',
    category: '',
    moreData: true,//更多数据
    limit: 6,//数量
    page: 1,//页码
    articles: [],
    bottomWord: '',
    loadMore: false,
    loadMores: false,
    coverBaseUrl: "http://image-cover.test.upcdn.net/2019/04/05/"
  },
  onLoad: function (options) {
    this.spinShow(true)
    this.getArticleList(this.data.page, this.data.limit);
  },
  getArticleList(page, limit) {
    var that = this;
    wx.request({
      url: 'http://localhost:8860/wechat/page/' + page,
      data: { "limit": limit },
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        let data = res && res.data && res.data.list;  
        if (data) {
          let articles = that.data.articles;
          articles.push.apply(articles, data);
          that.setData({
            'articles': articles,
            'page': page,
            'bottomWord': '',
            'loadMore': false,
          });
        } else {
          that.setData({
            'moreData': false,
            'bottomWord': '加载完',
            'loadMore': false,
          })
        }
        that.spinShow(false);
      }
    })

  },
  onReachBottom: function () {
    this.spinShow(true);
    if (this.data.moreData) {
      this.setData({
        'loadMore': true,
        'bottomWord': '加载中',
      });
      this.getArticleList(this.data.page + 1, this.data.limit);
    }
  },
  spinShow: function (value) {
    this.setData({
      loading: value,
    });
  },
  onShareAppMessage() {
    return {
      title: 'Mamba 博客',
      path: 'pages/index/index',
      imageUrl: '/images/blog.png'
    }
  }
})