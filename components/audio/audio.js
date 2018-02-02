Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    created: function (e) {
        let self = this;
        wx.onBackgroundAudioPlay(function () {
            self.setData({
                isPlaying: true
            })

        });
    
    },
    ready: function(){
        let self = this;
        
        wx.onBackgroundAudioStop(function(){
            let indexNow = self.data.index + 1;
            if(indexNow >= self.data.music.length){
                indexNow = 0;
            }
            self.setData({
                index: indexNow
            })
            

            wx.playBackgroundAudio({

                dataUrl: self.data.music[indexNow].musicUrl,
                title: `${self.data.music[indexNow].singer} - 
                            ${self.data.music[indexNow].musicName},`,
                success: function () {
                    self.data.isPlaying = true;


                    wx.setStorage({
                        key: "music",
                        data: self.data.music,

                    })
                    wx.setStorage({
                        key: "index",
                        data: indexNow,

                    })
                
                }


            })
            

        });
    },
    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    properties: {
       music: {
           type: Object,
           value: {},
           
        
       },
       showAudio: {
           type: Boolean,
           value: false
       },
       index: {
           type: Number,
           value: 0,
           observer: function (newVal, oldVal) {
               console.log(newVal);
               console.log(oldVal);

           }
       }
    //    isPlaying: {
    //        type: Boolean,
    //        value: false
    //    }
    },
    data: {
        musicObj: {},
        singerImg: "",
        singerName: "",
        musicName: "",
        isPlaying:true
    

    },
    methods: {
        audioPlay: function(){
            let self = this;
            wx.playBackgroundAudio() ;
            self.setData({
                isPlaying: true
            })
        },
        audioPause: function () {
            let self = this;
            wx.pauseBackgroundAudio();
            self.setData({
                isPlaying: false
            })
            console.log(self.data.isPlaying);
        },
        next: function(){
            wx.stopBackgroundAudio();
        }
    }
})