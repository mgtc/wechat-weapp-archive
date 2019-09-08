<template lang="html">

  <div>
    <flexbox orient="vertical" :gutter="10">
      <!-- top-banner -->
      <flexbox-item>
        <img src="../assets/common/top-banner.png" alt="" class="top-banner">
      </flexbox-item>
      <!-- input area -->
      <flexbox-item direction="column" align="center">
        <group label-width="4.5em" label-margin-right="2em" label-align="right">
          <!-- 你的名字 -->
          <flexbox>
            <flexbox-item :span="4"><cell title="你的名字"></cell></flexbox-item>
            <flexbox-item><x-input v-model="inputName" placeholder="点击输入"></x-input></flexbox-item>
          </flexbox>
          <!-- 性别 -->
          <flexbox>
            <flexbox-item :span="4">
              <cell title="你的性别"></cell>
            </flexbox-item>
            <flexbox-item>
              <checker v-model="sexChoice" default-item-class="sex-checker-item" selected-item-class="sex-checker-item-selected" radio-required>
                <checker-item value="男">男</checker-item>
                <checker-item value="女">女</checker-item>
              </checker>
            </flexbox-item>
          </flexbox>
          <!-- 出生日期 -->
          <flexbox>
            <flexbox-item :span="4"><cell title="出生日期"></cell></flexbox-item>
            <flexbox-item>
              <datetime v-model="inputDate" format="YYYY-MM-DD" placeholder="公历 请选择生日" default-selected-value="1990-01-01" :min-year="1900" :max-year="2019"></datetime>
            </flexbox-item>
          </flexbox>
          <!-- 出生时间 -->
          <flexbox>
            <flexbox-item :span="4"><cell title="出生时间"></cell></flexbox-item>
            <flexbox-item>
              <datetime v-model="inputTime" format="HH:mm" placeholder="默认为 00:00" default-selected-value="00:00"></datetime>
            </flexbox-item>
          </flexbox>
        </group>
        <br />
        <x-button
          style="width: 50%; border-radius: 50px; background: #d15057; color: #ffffff;"
          @click.native="toInfo">
          开始预测
        </x-button>
        <br v-for="i in 2">
      </flexbox-item>
      <!-- banner-area -->
      <flexbox-item class="banner-area">
        <img src="../assets/index/banner.png" alt="" class="banner">
      </flexbox-item>
      <!-- chart-area -->
      <flexbox-item>
        <flexbox orient="vertical" direction="column" justify="center">
          <flexbox-item direction="row" align="center">解锁报告，你将会得到</flexbox-item>
          <flexbox-item direction="row" align="center"><div style="color: rgb(207, 81, 89);">（输入出生日期看到更多信息）</div></flexbox-item>
          <flexbox-item direction="row" align="center"><img src="../assets/index/chart.png" alt=""></flexbox-item>
          <flexbox-item direction="row" align="center"><img src="../assets/index/counselor-1.png" alt=""></flexbox-item>
          <flexbox-item direction="row" align="center"><img src="../assets/index/counselor-2.png" alt=""></flexbox-item>
          <flexbox-item direction="row" align="center"><img src="../assets/index/counselor-3.png" alt=""></flexbox-item>
        </flexbox>
      </flexbox-item>
      <flexbox-item>
          <Footer></Footer>
      </flexbox-item>
    </flexbox>
  </div>

</template>

<script>
import Footer from '../components/Footer'
import * as globalData from '../util/config'

import {
  Group,
  GroupTitle,
  XInput,
  Checker,
  CheckerItem,
  Cell,
  Datetime,
  XButton,
  Flexbox,
  FlexboxItem
} from 'vux'

export default {
  components: {
    Group,
    GroupTitle,
    XInput,
    Checker,
    CheckerItem,
    Cell,
    Datetime,
    XButton,
    Footer,
    Flexbox,
    FlexboxItem
  },
  data: () => {
    return {
      showToast: false,
      inputName: '',
      inputDate: '',
      inputTime: '',
      sexChoice: '男'
    }
  },
  methods: {
    toInfo () {
      // demo date
      // let openid = globalData.default.openid
      // let uname = '阿炳'
      // let sex = '男'
      // let yy = '1990'
      // let mm = '1'
      // let dd = '1'
      // let hh = '1'

      let openid = globalData.default.openid
      let sex = this.$data.sexChoice
      let uname = this.$data.inputName
      let dateArr = this.$data.inputDate.split('-')
      let yy = dateArr[0]
      let mm = dateArr[1]
      let dd = dateArr[2]
      let hh = this.$data.inputTime.split(':')[0]
      console.log(openid, sex, uname, yy, mm, dd, hh)

      // ajax
      let params = {
        openid: openid,
        uname: uname,
        sex: sex,
        yy: yy,
        mm: mm,
        dd: dd,
        hh: hh
      }

      let App = this
      App.$http.post('/h5-wealth/order', params)
        .then(function (res) {
          if (res.data.order.orderId) {
            let orderId = res.data.order.orderId
            App.$cookie.set('orderid', orderId, { expires: 30 })
            App.$router.push({ path: '/info/' + orderId })
          }
        })
        .catch(function (error) {
          console.error('order.url fail', error)
        })
      // ajax end

      if (!this.$data.inputTime) {
        this.$vux.toast.show({ text: '请选择出生时间', time: 1000 })
      }

      if (!this.$data.inputDate) {
        this.$vux.toast.show({ text: '请选择生日', time: 1000 })
      }
      if (!uname) {
        this.$vux.toast.show({ text: '请输入名字', time: 1000 })
      }
      if (!openid) {
        this.$vux.toast.show({
          text: '出错啦！',
          time: 1000,
          onHide: () => { this.$router.push({ path: '/' }) }
        })
      }
    }
  }
}
</script>

<style lang="less">
img {
  display: inline-block;
  width: 100%;
  overflow: hidden;
}

.vux-header-title {
  color: #000 !important;
}

.top-banner-box {
  width: 100%;
}

.top-banner {
  width: 100%;
  height: 300rpx;
}

.banner-area {
  margin-top: 107px;
}

.banner {
  height: 614px;
  background-size: cover;
}

.sex-checker-item {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 50%;
  line-height: 40px;
  text-align: center;
}
.sex-checker-item-selected {
  border-color: #d15057;
  background-color: #d15057;
  color: #fff;
  font-size: bold;
}

</style>
