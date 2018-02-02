// hot.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        music: {},
        index: 0,
        showAudio: false,
        songList: [],
        date: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getHotData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let self = this;
        wx.getStorage({
            key: 'music',
            success: function (res) {
                console.log(res.data);
                self.setData({
                    music: res.data

                })
            }
        })
        wx.getStorage({
            key: 'index',
            success: function (res) {
                self.setData({
                    index: res.data
                })
            }

        })
        wx.getStorage({
            key: 'showAudio',
            success: function (res) {
                self.setData({
                    showAudio: res.data
                })
            }
        })
    },
    getHotData: function () {
        let self = this;
        wx.request({
            url: `https://www.yizicheng.cn/rank?rankid=8888`,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (data) {
                let res = data.data.songs;
                self.setData({
                    songList: res.list,
                    date: self.getLocalTime(res.timestamp).substring(0, 10)
                })
                for (let i = 0; i < self.data.songList.length; i++) {

                    if (self.data.songList[i].filename.indexOf("【") !== -1) {

                        let temp = self.data.songList[i].filename.replace("【", "(");
                        temp = temp.replace("】", ")");
                        let songName = temp.split("-")[1].split("(")[0];
                        let intro = "(" + temp.split("(")[1];
                        self.setData({
                            [`songList[${i}].filename`]: temp,
                            [`songList[${i}].songName`]: songName,
                            [`songList[${i}].intro`]: intro,

                        })

                    }
                    let singer = self.data.songList[i].filename.split("-")[0];
                    let musicName = self.data.songList[i].filename.split("-")[1];
                    self.setData({
                        [`songList[${i}].singer`]: singer,
                        [`songList[${i}].musicName`]: musicName,
                    })

                    self.getMusicInfo(self.data.songList[i].hash, i, "songList");

                }
                self.setData({
                    getNewList: true
                })



            }
        })

    },
    getMusicInfo: function (hash, index, list) {
        let self = this;
        wx.request({
            url: `https://www.yizicheng.cn/music?hash=${hash}`,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (data) {
                let res = data.data;
                let img = res.data.img;
                let music = res.data.play_url;
                self.setData({
                    [`${list}[${index}].imgUrl`]: img,
                    [`${list}[${index}].musicUrl`]: music
                })

                let lyricsTemp = res.data.lyrics.split("\r\n");
                // this.render(lyricsTemp);


            }
        })
    },
    getLocalTime: function (nS) {
        return new Date(parseInt(nS) * 1000).toJSON();
    },
    playMusic: function (e) {
        let index = e.currentTarget.dataset.index;
        let self = this;

        this.setData({
            music: this.data.songList,
            index: index,
            showAudio: true
        })
        wx.playBackgroundAudio({

            dataUrl: this.data.songList[index].musicUrl,
            title: `${this.data.songList[index].singer} - 
                            ${this.data.songList[index].musicName},`,
            success: function () {
                self.data.isPlaying = true;

                wx.setStorage({
                    key: "music",
                    data: self.data.music,

                })
                wx.setStorage({
                    key: "index",
                    data: self.data.index,

                })
                wx.setStorage({
                    key: "showAudio",
                    data: self.data.showAudio,

                })
            }
        })
    },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})