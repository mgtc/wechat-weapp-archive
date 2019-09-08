const app = getApp();
Component({
  properties: {
    isIndex: { // 是否主页            
      type: Boolean,
      value: false,
    },
    title_height: { //             
      type: String,
      value: "64",
    },

    statusbarHeight: {
      type: String,
      value: "24",
    },
    
    title_text: {
      type: String,
      value: '标题栏文字',
    },
  },
  methods: {
  }
})