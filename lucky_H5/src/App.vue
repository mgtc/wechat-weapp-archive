<template>
  <div id="app">
    <!-- <sticky>
      <x-header :left-options="{showBack: false}" style="background-color:#FFF">2018年运</x-header>
    </sticky> -->
    <router-view></router-view>
  </div>
</template>

<script>
import {
  Sticky,
  XHeader
} from 'vux'

export default {
  name: 'app',
  components: {
    Sticky,
    XHeader
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import './style/theme.less';
@import '~vux/src/styles/1px.less';

body {
  background-color: #f8f5f1;
}
</style>
