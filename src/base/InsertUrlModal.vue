<template>
  <a-modal v-model="visible" title="插入链接" @ok="handleOk" @cancel="handleCancel" centered>
    <a-input type="url" placeholder="请输入您需要插入的链接"></a-input>
  </a-modal>
</template>

<script>
export default {
  name: 'InsertUrlModal',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      visible: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less"></style>
