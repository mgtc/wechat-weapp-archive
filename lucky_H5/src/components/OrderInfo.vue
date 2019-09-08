<template lang="html">
  <div class="container">
    <flexbox orient="vertical" :gutter="10">
      <!-- confirm info -->
      <div v-transfer-dom>
        <confirm v-model="show"
          title="跳转微信付款" theme="ios" confirm-text="已支付完成"
          cancel-text="未支付完成"
          @on-confirm="onConfirm"
        >
        </confirm>
      </div>
      <!-- popup info -->
      <div v-transfer-dom>
        <popup v-model="show2" position="top" :show-mask="false">
          <div style="color:#000; text-align: center; padding: 15px; background-color: #ffe26d;">
            订单号： {{this.$route.params.orderid}} <br />
            如需详细了解今年财运，请关注微信公众号「XX运势」
          </div>
        </popup>
      </div>
      <!-- basic info -->
      <!-- 个人信息 -->
      <div class="profile">
        <span class="uname">{{inputName}}</span>
        <img
          v-if="sex === '男'"
          class="sex-img"
          src="../assets/info/male.png" />
        <img
          v-else
          class="sex-img"
          src="../assets/info/female.png" />
        <span class="sex">{{sex}}</span>
      </div>
      <!-- 八字 -->
      <flexbox-item direction="column" align="left" class="bazi">
        <flexbox direction="row" align="center">
          <flexbox-item :span="1/24"></flexbox-item>
          <flexbox-item>公历<br/>八字</flexbox-item>
          <flexbox-item :span="1/24">
            <div class="vertical-line"></div>
          </flexbox-item>
          <flexbox-item>
            {{ yy.time }}年<br />{{ yy.bazi }}
          </flexbox-item>
          <flexbox-item>
            {{ mm.time }}月<br />{{ mm.bazi }}
          </flexbox-item>
          <flexbox-item>
            {{ dd.time }}日<br />{{ dd.bazi }}
          </flexbox-item>
          <flexbox-item>
            {{ hh.time }}时<br />{{ hh.bazi }}
          </flexbox-item>
        </flexbox>
      </flexbox-item>
      <!-- 流月运势图 -->
      <flexbox-item  direction="column" align="center">
        <div>
          <img class="calendar-img" src="../assets/info/calendar.png" alt="">
          <span>2018每月运势</span>
        </div>
        <div id="score-chart"></div>
      </flexbox-item>
      <!-- state info -->
      <!-- report -->
      <flexbox-item
        class="report-box"
        direction="column"
        align="center"
        v-if="state === true">
        <!-- 五行比例 -->
        <flexbox class="item-box charts" orient="vertical">
          <flexbox-item direction="column" align="center">
            <div>
              <span class="ele-title">五行力量</span>
            </div>
            <div id="ele-chart"></div>
          </flexbox-item>
        </flexbox>
        <!-- 性格概述 -->
        <flexbox class="item-box" orient="vertical" :gutter="15">
          <flexbox-item direction="column" align="center">
            <div><span class="ele-title item-title">先天性格概述</span></div>
          </flexbox-item>
          <flexbox-item direction="column" align="left">
            <div class="charDesc-content">{{charDesc.sum}}</div>
          </flexbox-item>
          <flexbox-item direction="column" align="left">
            <div class="charDesc-content">「{{charDesc.type}}」事业:</div>
            <div class="charDesc-content">{{charDesc.career}}</div>
          </flexbox-item>
          <flexbox-item direction="column" align="left">
            <div class="charDesc-content">「{{charDesc.type}}」友情:</div>
            <div class="charDesc-content">{{charDesc.friend}}</div>
          </flexbox-item>
          <flexbox-item direction="column" align="left">
            <div class="charDesc-content">「{{charDesc.type}}」爱情:</div>
            <div class="charDesc-content">{{charDesc.love}}</div>
          </flexbox-item>
          <!-- 代表人物 -->
          <flexbox-item direction="column" align="left">
            <div class="charDesc-content">
              <span class="idol-title ele-title">代表人物</span>
            </div>
            <flexbox class="idol-box" orient="horizontal">
              <flexbox-item
                v-for="(val, index) in idol"
                :key="index"
                direction="column"
                align="center">
                <img
                  class="idol-img"
                  :src="val.url" />
                <div>{{val.name}}</div>
              </flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
        <!-- 五行喜好 -->
        <flexbox class="item-box" orient="vertical">
          <flexbox-item direction="column" align="center">
            <div><span class="ele-title item-title">五行喜好</span></div>
          </flexbox-item>
          <!-- 行1 -->
          <flexbox direction="row" align="center">
            <flexbox direction="row" align="center" :gutter="0">
              <flexbox-item align="center"></flexbox-item>
              <flexbox-item align="center">方位</flexbox-item>
              <flexbox-item align="center">
                {{eleLike.direction}}
              </flexbox-item>
              <flexbox-item align="center"></flexbox-item>
            </flexbox>
            <div class="vertical-line"></div>
            <flexbox direction="row" align="center" :gutter="0">
              <flexbox-item align="center"></flexbox-item>
              <flexbox-item align="center">数字</flexbox-item>
              <flexbox-item align="center">
                {{eleLike.number}}
              </flexbox-item>
              <flexbox-item align="center"></flexbox-item>
            </flexbox>
          </flexbox>
          <!-- 行2-->
          <flexbox direction="row" align="center">
            <flexbox direction="row" align="center" :gutter="0">
              <flexbox-item align="center"></flexbox-item>
              <flexbox-item align="center">颜色</flexbox-item>
              <flexbox-item align="center">
                <span style="vertical-align: middle;">
                  {{colors[eleLike.color]}}
                </span>
                <div :class="eleLike.color" class="color-box"></div>
              </flexbox-item>
              <flexbox-item align="center"></flexbox-item>
            </flexbox>
            <div class="vertical-line"></div>
            <flexbox direction="row" align="center" :gutter="0">
              <flexbox-item align="center"></flexbox-item>
              <flexbox-item align="center">元素</flexbox-item>
              <flexbox-item align="center">
                <span style="vertical-align: middle;">
                  {{eleLike.ele}}
                </span>
                <span style="vertical-align: middle;">
                  {{emoji[eleLike.ele]}}
                </span>
              </flexbox-item>
              <flexbox-item align="center"></flexbox-item>
            </flexbox>
          </flexbox>
        </flexbox>
        <!-- 年总评 -->
        <flexbox class="item-box" orient="vertical">
          <flexbox-item align="center">
            <div><span class="ele-title item-title">戌狗年总评</span></div>
          </flexbox-item>
          <flexbox-item
            align="center"
            v-for="(val, index) in yearDesc" :key="index">
            <div class="yearDesc-content">{{val}}</div>
          </flexbox-item>
        </flexbox>
        <!-- 流月详述 -->
        <flexbox class="item-box" orient="vertical" :gutter="20">
          <flexbox-item align="center">
            <div><span class="ele-title item-title">流月运势</span></div>
          </flexbox-item>
          <flexbox
            v-for="(val, index) in monthDesc" :key="index"
            orient="vertical">
            <!-- 月份 -->
            <flexbox-item align="left">
              <div class="month-item">
                <span style="font-weight: bold;margin-left: -5px">
                  「{{months[index].tgdz}}」月
                </span>
                <span style="margin-left: 5px">
                  {{months[index].duration}}
                </span>
              </div>
            </flexbox-item>
            <!-- 宜忌 -->
            <flexbox-item align="left">
              <div class="month-item">
                <span class="label-title">宜</span>
                <div class="label-vertical-line"></div>
                <span
                  class="label-content"
                  v-for="(tag, index) in val.label['good']" :key="index">
                  {{tag}}
                </span>
              </div>
              <div class="month-item">
                <span class="label-title">忌</span>
                <div class="label-vertical-line"></div>
                <span
                  class="label-content"
                  v-for="(tag, index) in val.label['bad']" :key="index">
                  {{tag}}
                </span>
              </div>
            </flexbox-item>
            <!-- 月分数 -->
            <flexbox-item align="left">
              <div class="month-item">
                <span>本月运势: </span>
                <span v-for="i in val.score" :key="index">🌟</span>
                <span
                  :class="score[index]>70? 'red-text':(score[index]<50?'green-text':'')"
                  style="float: right;">
                  {{score[index]}}分
                </span>
              </div>
            </flexbox-item>
            <!-- 月描述 -->
            <flexbox-item align="left">
              <div class="month-item">{{val.desc}}</div>
            </flexbox-item>
            <!-- horizontal line -->
            <flexbox-item align="left">
              <div class="horizontal-line"></div>
            </flexbox-item>
          </flexbox>
        </flexbox>
        <!-- 二维码，订单号，导流文案 -->
        <flexbox orient="vertical">
          <flexbox-item align="center" class="adv-item">
            <div>对本年度财运报告还有疑虑？</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div>想了解自己今年详细财富运势？</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div>可关注下方XX运势微信公众号</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div>在对话框输入 #年运</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div>付费后即可获得</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div>XX运势微信私聊1小时测算全年财运服务</div>
          </flexbox-item>
          <flexbox-item align="center" class="adv-item">
            <div style="color:#d15057;"><strong>微信搜索公众号「XX运势」</strong></div>
            <div>
              <img class=""
                src="../assets/common/qrcode.jpg" />
            </div>
          </flexbox-item>
        </flexbox>
      </flexbox-item>

      <!-- hint  -->
      <flexbox-item
        direction="column"
        align="center"
        v-else>
        <flexbox class="hint-box" v-for="(hint, index) in hints" :key="index" direction="column" align="center">
          <div class="hint-content">
            <flexbox-item class="hint-title-wrapper" style="width: 100%;" direction="row" align="center">
              <div class="hint-title">
                <img src="../assets/info/icon.png" alt="" class="hint-img">
                <span>{{ hint.title }}</span>
                <img src="../assets/info/icon.png" alt="" class="hint-img">
              </div>
            </flexbox-item>
            <div class="hint-desc" v-for="(desc, index) in hint.desc" :key="index"  direction="row" align="center">
              {{ desc }}
            </div>
          </div>
          <div class="pay-btn" @click="wxPay">
            <img src="../assets/info/lock.png" alt="" class="hint-img">
            <span>解锁查看详情</span>
          </div>
        </flexbox>
        <flexbox direction="column" align="center" class="hint-footer">
          <div class="img-box">
            <img
              v-for="(val, index) in [1,1,1]" :key="index"
              src="../assets/info/icon.png"
              alt=""
              class="hint-img">
          </div>
          <span class="footer-desc">感情、事业、财富、健康、人际...</span>
          <span class="footer-desc">选择比努力更重要，趋利避害、集中发力，</span>
          <span class="footer-desc">用不到一杯星巴克的价格，现在解锁你的全年运势导航</span>
          <XButton class="unlock-btn" @click.native="wxPay">
            <img src="../assets/info/lock.png" alt="" class="hint-img">
            <span>解锁我的八字运势¥ 38</span>
          </XButton>
        </flexbox>
        <!-- <XButton plain type="primary" class="unlock-box-btn">
          <img class="btn-logo" src='../assets/info/lock.png' background-size="cover">
          <span>立即解锁¥ 38</span>
        </XButton> -->
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { Popup, Confirm, XButton, Flexbox, FlexboxItem, TransferDomDirective as TransferDom } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Confirm,
    XButton,
    Flexbox,
    FlexboxItem
  },
  beforeMount: function () {
    this.getOrderInfo()
  },
  updated: function () {
    this.drawChart()
  },
  methods: {
    // 更新订单数据
    updateData: function (data) {
      this.inputName = data.uname
      this.sex = data.sex
      this.yy = data.yy
      this.mm = data.mm
      this.dd = data.dd
      this.hh = data.hh
      this.score = data.score
      this.state = data.state
      if (data.state) {
        this.force = data.force
        this.charDesc = data.charDesc
        this.idol = data.idol
        this.eleLike = data.eleLike
        this.yearDesc = data.yearDesc
        this.monthDesc = data.monthDesc
      }
    },
    // 绘图
    drawChart: function () {
      // 分数
      let scoreChart = this.$echarts.init(document.getElementById('score-chart'))
      let options = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0
          },
          data: ['2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}分'
          }
        },
        series: [{
          name: '运势',
          data: this.score,
          type: 'line',
          lineStyle: {
            color: '#adceed'
          },
          areaStyle: {
            color: '#adceed'
          }
        }]
      }
      scoreChart.setOption(options, true)
      if (this.state) {
        // 五行
        let elementChart = this.$echarts.init(document.getElementById('ele-chart'))
        let eCoptions = {
          legend: {
            width: '90%',
            bottom: '10',
            x: 'center',
            data: ['木', '火', '土', '金', '水'],
            formatter: (name) => {
              let percent = ((this.force[name] / 10000) * 100).toFixed(2)
              return `${name} ${percent}%`
            }
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            center: ['50%', '40%'],
            radius: '50%',
            label: {
              show: false
            },
            data: [
              { value: this.force['木'], name: '木' },
              { value: this.force['火'], name: '火' },
              { value: this.force['土'], name: '土' },
              { value: this.force['金'], name: '金' },
              { value: this.force['水'], name: '水' }
            ]
          }],
          color: ['#466F3F', '#F86D34', '#DFAA45', '#F4DE45', '#3ABEF2']
        }
        elementChart.setOption(eCoptions, true)
      }
    },
    // 获取订单详情
    getOrderInfo: function () {
      let params = {
        openid: this.$cookie.get('openid'),
        orderId: this.$route.params.orderid
      }
      this.$http.post('/h5-wealth/orderinfo', params)
        .then((res) => {
          // 设置数据
          this.updateData(res.data.orderInfo)
        })
        .catch(function (error) {
          console.error('order.info fail', error)
          this.$vux.toast.show({ text: '请求订单出错啦', time: 1000 })
        })
    },
    // 支付
    wxPay () {
      this.show = true
      let params = {
        openid: this.$cookie.get('openid'),
        orderId: this.$route.params.orderid,
        fee: 38,
        sceneInfo: '{"h5_info": { "type": "Wap", "wap_url": "http://xxxdomain.com/wealth", "wap_name": "XX运势H5" } }'
      }
      this.$http.post('/h5-wealth/pay', params)
        .then(function (res) {
          let mwebUrl = res.data.mwebUrl
          let callbackUrl = window.location.href
          // window.location.href = mwebUrl + '&redirect_url=' + callbackUrl
          window.open(mwebUrl + '&redirect_url=' + callbackUrl)
        })
        .catch(function (error) {
          console.error('wxPay fail', error)
        })
    },
    // 已支付完成，刷新页面
    onConfirm () {
      location.reload()
    },
    // 支付完成的订单，监听滚动事件, 显示订单号
    onScroll () {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop
      if (this.scroll > 80 && this.state) {
        this.show2 = true
      } else {
        this.show2 = false
      }
    }
  },

  data () {
    return {
      show: false,  // Confirm
      show2: false, // Popup
      scroll: '',
      months: [
        { tgdz: '甲寅', duration: '02.04 ~ 03.05' },
        { tgdz: '乙卯', duration: '03.05 ~ 04.05' },
        { tgdz: '丙辰', duration: '04.05 ~ 05.05' },
        { tgdz: '丁巳', duration: '05.05 ~ 06.06' },
        { tgdz: '戊午', duration: '06.06 ~ 07.07' },
        { tgdz: '己未', duration: '07.07 ~ 08.07' },
        { tgdz: '庚申', duration: '08.07 ~ 09.08' },
        { tgdz: '辛酉', duration: '09.08 ~ 10.08' },
        { tgdz: '壬戌', duration: '10.08 ~ 11.07' },
        { tgdz: '癸亥', duration: '11.07 ~ 12.07' },
        { tgdz: '甲子', duration: '12.07 ~ 01.05' },
        { tgdz: '乙丑', duration: '01.05 ~ 02.04' }
      ],
      // 未付费
      hints: [
        {
          title: '先天性格',
          desc: [
            '你先天的最大个性特征与优势在哪里？',
            '如何在事业、爱情、人际分别体现？',
            '从易学十神论的心理学角度出发，解析你的最大优势。'
          ]
        }, {
          title: '五行喜好',
          desc: [
            '什么方位利好你的发展？',
            '什么颜色、数字，利于你的五行平衡？',
            '从八字格局角度，给出你的实用喜忌密码。'
          ]
        }, {
          title: '戌狗年总评',
          desc: [
            '公历2月5日，戌狗年即将到来。',
            '大吉？还是小灾？',
            '事业、桃花、财富、人际...大趋势助你一臂之力。'
          ]
        }, {
          title: '流月运势',
          desc: [
            '甲寅/乙卯/丙辰/丁巳...',
            '12个流月喜忌，做哪些事更容易成功？',
            '个人军师帮你指引。'
          ]
        }
      ],
      // 获取
      inputName: '',
      sex: '',
      yy: { time: '', bazi: '' },
      mm: { time: '', bazi: '' },
      dd: { time: '', bazi: '' },
      hh: { time: '', bazi: '' },
      score: [],

      // 付费
      colors: {
        'green': '绿',
        'red': '红',
        'yellow': '黄',
        'white': '白',
        'black': '黑'
      },
      emoji: {
        '木': '🌲',
        '火': '🔥',
        '土': '🌏',
        '金': '🌟',
        '水': '💧'
      },
      // 获取
      force: {},
      charDesc: [],
      idol: [],
      eleLike: {},
      yearDesc: '',
      monthDesc: [],

      // 订单
      orderId: null,
      state: null // 订单状况
    }
  },
  computed: {
    scoreText: function () {
      let scoreTextClass = []
      for (const i in this.socre) {
        if (this.score[i] >= 70) scoreTextClass[i] = 'red-text'
        else if (this.score < 50) scoreTextClass[i] = 'green-text'
        else scoreTextClass[i] = ''
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="less">
/* basic */
.profile {
  width: 100%;
  box-sizing: border-box;
  padding: 1em;
  font-size: 1em;
  .sex-img {
    margin-left: 0.5em;
    margin-right: 0.5em;
    width: 1em;
    height: 1em;
  }
}

.bazi {
  font-size: 0.6em;
  margin: 0 auto;
  padding: 0.3em 0;
  border-top: 0.2em solid #fff;
  border-bottom: 0.2em solid #fff;
  .vertical-line {
    width: 0.2em;
    height: 3em;
    background-color: #d15057;
  }
}

// canvas
#score-chart {
  width: 100%;
  height: 300px;
}
.calendar-img {
  width: 1.2em;
  height: 1.2em;
  margin: 0 0.5em;
  vertical-align: text-top;
}
.report-box {
  // 五行比例
  #ele-chart {
    width: 100%;
    height: 300px;
  }
  .ele-title {
    position: relative;
    font-size: 1em;
  }
  .ele-title:before {
    content: "";
    position: absolute;
    background: #3e3a39;
    width: 5px;
    height: 1px;
    left: -10px;
    top: 50%;
  }
  .ele-title:after {
    content: "";
    position: absolute;
    background: #3e3a39;
    width: 5px;
    height: 1px;
    right: -10px;
    top: 50%;
  }
  .item-box {
    margin-top: 15px;
  }
  .item-title {
    font-size: 16pt;
  }
  .idol-title {
    margin-left: 10px;
  }
  .charDesc-content {
    padding: 5px 0;
    margin: 0 20px;
    font-size: 11pt;
  }
  .idol-img {
    width: 65%;
    height: 65%;
    margin: 5px;
    border-radius: 50%;
  }
  .vertical-line {
    width: 0.2em;
    height: 1.2em;
    background-color: #d15057;
  }

  // 五行喜好
  .color-box {
    display: inline-block;
    vertical-align: middle;
    width: 1em;
    height: 1em;
    border-radius: 50%;
  }
  // 流年
  .yearDesc-content {
    padding: 8px;
    font-size: 11pt;
  }
  // 流月
  .month-item {
    padding: 5px 15px;
    font-size: 11pt;
  }
  .label-title {
    vertical-align: middle;
    margin-left: 15px;
    color: #d15057;
  }
  .label-content {
    vertical-align: middle;
    padding: 0 2px;
    margin: 0 1px;
  }
  .label-vertical-line {
    vertical-align: middle;
    margin: 0 10px;
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: #d15057;
  }
  .horizontal-line {
    margin: 15px auto;
    width: 80%;
    height: 1px;
    background-color: #d15057;
  }
}
.red-text {
  color: #d15057;
  font-weight: bold;
}

.green-text {
  color: #466f3f;
  font-weight: lighter;
}
.green {
  background: #9ed048;
}

.red {
  background: #ff461f;
}

.yellow {
  background: #ffa631;
}

.white {
  background: #ffffff;
}

.black {
  background: #312520;
}
/* hint(unpaid) */
.hint-box {
  margin-top: 1em;
  .hint-content {
    width: 95%;
    /* height: 10em; */
    background-color: #fff;
    margin: 0 auto;
    padding: 1em;
    font-size: 0.8em;
    box-sizing: border-box;
    border-radius: 5rpx;
  }
  .hint-desc {
    width: 100%;
    margin-top: 5px;
  }
  .hint-img {
    vertical-align: middle;
    width: 1em;
    height: 1em;
  }
  .pay-btn {
    margin-top: 10px;
    color: #cf5159;
    font-size: 0.8em;
    .hint-img {
      vertical-align: middle;
      width: 1.5em;
      height: 1.5em;
    }
  }
}
.hint-footer {
  margin: 30px 0 50px 0;
  .img-box {
    padding-bottom: 10px;
    position: relative;
    margin-bottom: 10px;
  }
  .img-box:after {
    content: " ";
    position: absolute;
    left: 25%;
    bottom: 0;
    height: 4px;
    width: 50%;
    border-bottom: 1px solid rgb(207, 81, 89);
    color: rgb(207, 81, 89);
  }
  .footer-desc {
    font-weight: lighter;
    font-size: 0.8em;
    line-height: 0.8em;
    padding: 5px 0;
  }
  .unlock-btn {
    position: fixed;
    bottom: 10px;
    width: 65%;
    background: #cf5159;
    color: #fff;
    font-size: 0.8em;
    .hint-img {
      vertical-align: middle;
      width: 0.8em;
      height: 0.8em;
    }
  }
}

/* report(paid) */
</style>
