<template lang="html">
  <flexbox orient="vertical" direction="column" justify="center">
    <flexbox-item></flexbox-item>
    <flexbox-item direction="row" align="center"> 关注公众号「XX运势」</flexbox-item>
    <flexbox-item></flexbox-item>
    <flexbox>
      <flexbox-item></flexbox-item>
      <flexbox-item direction="row" align="center"><img src="../assets/common/qrcode.jpg" alt=""></flexbox-item>
      <flexbox-item></flexbox-item>
    </flexbox>
    <flexbox-item></flexbox-item>
  </flexbox>
</template>

<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    Flexbox,
    FlexboxItem
  }
}
</script>

<style lang="css">
</style>
