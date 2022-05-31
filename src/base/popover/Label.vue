<template>
  <div class="label-container">
    <div class="popover-type">标签</div>
    <textarea
      class="label-textarea"
      placeholder="请输入标签"
      ref="textarea"
      v-model="value"
    ></textarea>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Label',
  data() {
    return {
      value: '',
      selected: null
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  mounted() {
    this.$refs.textarea.focus()
    this.getLabel()
    this.$emit('fix-position')
  },
  beforeDestroy() {
    this.setLabel()
  },
  created() {},
  methods: {
    // 获取标签内部的值
    getLabel() {
      const value = this.minder.queryCommandValue('label') || []
      this.value = value.join()
    },
    // 设置标签的值
    setLabel() {
      const value = this.value.replace(/\r?\n|(?<!\n)\r/gi, '').trim()
      this.minder.execCommand('label', value)
    }
  }
}
</script>

<style scoped lang="less">
.label-container {
  min-width: 300px;
  padding: 10px;
}
.popover-type {
  color: rgba(0, 0, 0, 0.2);
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: bold;
}
.label-textarea {
  width: 100%;
  resize: none;
  max-width: 100%;
  min-height: 100px;
  outline: none;
  border: none;
  color: #6c6c6c;
}
</style>
