<template>
  <transition name="slide-fade-left">
    <div class="search-modal-container" v-if="visible">
      <input
        ref="input"
        placeholder="输入回车搜索"
        class="search-input"
        @input="handleSearchTextChange"
        @keydown.enter="handleNext"
        v-model="searchText"
      />
      <span class="counter">{{ `${allSelected ? selected + 1 : 0}/${allSelected}` }}</span>
      <span class="vertical"></span>
      <a-icon class="icon icon-up" type="up" @click="handlePrev"></a-icon>
      <a-icon class="icon icon-down" type="down" @click="handleNext"></a-icon>
      <a-icon class="icon icon-close" type="close" @click="handleClose"></a-icon>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SearchNode',
  filters: {},
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      searchText: '',
      selected: 0,
      allSelected: 0
    }
  },
  computed: {
    ...mapGetters(['minder'])
  },
  watch: {},
  mounted() {
    this.minder.on('searchrequest', () => {
      this.visible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.input.focus()
        }, 500)
      })
    })
  },
  created() {},
  methods: {
    // 搜索弹窗
    handleSearchTextChange(e) {
      const { value } = e.target
      this.selected = 0
      this.allSelected = 0
      this.handleSearch(value)
    },
    // 处理搜索 复用
    handleSearch(value) {
      if (!value || this.allSelected === 1) return
      const searchNodes = this.minder.getNodesByKey(value)
      this.allSelected = searchNodes.length
      if (this.allSelected) {
        const selected = searchNodes[this.selected]
        if (selected) {
          this.minder.select(selected, true)
          this.minder.execCommand('camera', selected, 600)
        }
      } else {
        this.allSelected = 0
        this.select = 0
      }
    },
    // 下一个
    handleNext() {
      if (this.selected >= this.allSelected - 1) {
        this.selected = 0
      } else {
        this.selected++
      }
      this.handleSearch(this.searchText)
    },
    // 上一个
    handlePrev() {
      if (this.selected <= 0) {
        this.selected = this.allSelected - 1
      } else {
        this.selected--
      }
      this.handleSearch(this.searchText)
    },
    // 关闭
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.search-modal-container {
  position: fixed;
  right: 16px;
  display: flex;
  top: 90px;
  align-items: center;
  justify-content: center;
  padding: 10px 5px;
  background: #fff;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  // padding: 5px 0;
  .search-input {
    border: none;
    border: none;
    outline: none;
    font-size: 13px;
    color: #777777;
    padding-left: 5px;
  }
  .counter {
    font-size: 12px;
    letter-spacing: 2px;
  }
  .vertical {
    width: 1px;
    height: 18px;
    background-color: #e8e8e8;
    margin: 0 10px;
  }
  .icon {
    font-size: 12px;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    color: #777777;
    &:hover {
      background-color: #f2f3f5;
    }
  }
}

.slide-fade-left-enter-active {
  transition: all 0.25s linear;
}
.slide-fade-left-leave-active {
  transition: all 0.25s linear;
}
.slide-fade-left-enter,
.slide-fade-left-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
