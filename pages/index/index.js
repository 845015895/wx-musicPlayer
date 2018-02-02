//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        commandText: "推荐",
        newText: "最新音乐",
        data: "",
        soaringSongList: [],
        showImg: 0,
        songList: [],
        getNewList: false,
        isPlaying: false,
        music: {},
        showAudio: false
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.getSoarMusic();
        this.getNewData();
    },
    onShow: function(){
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
    getSoarMusic: function () {
        let self = this;
        let data = [];
        wx.request({
            url: 'https://www.yizicheng.cn/rank?rankid=22163',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                data = res.data.songs;
                self.setData({
                    soaringSongList: data.list.slice(0, 6)
                })
                
                for (let i = 0; i < self.data.soaringSongList.length; i++) {
                    self.getSoaringMusicInfo(self.data.soaringSongList[i].hash, i);
                    let singer = self.data.soaringSongList[i].filename.split("-")[0];
                    let musicName = self.data.soaringSongList[i].filename.split("-")[1];
                    self.setData({
                        [`soaringSongList[${i}].singer`]: singer,
                        [`soaringSongList[${i}].musicName`]: musicName,
                    })
                }

            }
        })
    },
    getSoaringMusicInfo: function (hash, index) {
        this.getMusicInfo(hash, index, "soaringSongList");
    },
    getNewData: function () {
        let self = this;
        wx.request({
            url: `https://www.yizicheng.cn/rank?rankid=31308`,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (data) {
                let res = data.data.songs;
                self.setData({
                    songList: res.list
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
    playMusic: function(e){
        let listType = e.currentTarget.dataset.listtype;
        let index = e.currentTarget.dataset.index;
        let self = this;
        
        // if(this.data.isPlaying){
        //     wx.pauseBackgroundAudio();
        //     this.setData({
        //         isPlaying: false
        //     })
        // }else{
            if (listType === "soar") {

                this.setData({
                    music: this.data.soaringSongList,
                    index: index,
                    showAudio: true
                })
                wx.playBackgroundAudio({

                    dataUrl: this.data.soaringSongList[index].musicUrl,
                    title: `${this.data.soaringSongList[index].singer} - 
                            ${this.data.soaringSongList[index].musicName},`,
                    success: function(){
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
            } else if (listType === "new"){
                this.setData({
                    music: this.data.songList,
                    index: index,
                    showAudio: true
                })
                wx.playBackgroundAudio({

                    dataUrl: this.data.songList[index].musicUrl,
                    title: `${this.data.songList[index].singer} - ${this.data.songList[index].musicName}`,
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
            }

          


        // }
    },
    getMusicInfo: function(hash,index,list){
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
                self.setData({
                    showImg: self.data.showImg + 1
                })

            }
        })
    }


})
