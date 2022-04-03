<template>
  <div class="rainbow-lines-container">
    <a-dropdown-button style="width: 100%">
      <div class="rainbow-lines-wrapper" :style="defaultChoose.style" v-if="isDefault">
        <div class="color-one">{{ defaultChoose.text }}</div>
      </div>
      <div class="rainbow-lines-wrapper" v-else>
        <div
          class="color-one"
          :style="{ background: color }"
          v-for="color in chooseColor"
          :key="color"
        ></div>
      </div>
      <a-menu slot="overlay" @click="handleMenuClick">
        <a-menu-item key="default-choose">
          <div class="rainbow-lines-wrapper" :style="defaultChoose.style">
            <div class="color-one">{{ defaultChoose.text }}</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="(item, index) in rainbowColors" :key="index">
          <div class="rainbow-lines-wrapper">
            <div
              class="color-one"
              :style="{ background: color }"
              v-for="color in item.colors"
              :key="color"
              :title="item.title"
            ></div>
          </div>
        </a-menu-item>
      </a-menu>
      <a-icon slot="icon" type="caret-down" />
    </a-dropdown-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { RAINBOW_COLORS } from '@/config'
export default {
  name: 'RainbowLines',
  computed: {
    ...mapGetters(['minder']),
    rainbowColors() {
      return RAINBOW_COLORS.slice()
    },
    defaultChoose() {
      return {
        text: '-- 默认线条颜色 --',
        style: 'text-align: center; height: auto'
      }
    }
  },
  data() {
    return {
      isDefault: true,
      chooseColor: []
    }
  },
  mounted() {
    this.chooseColor = this.minder.getRainbowConnect() || []
    this.isDefault = !this.chooseColor.length
  },
  methods: {
    // 选择彩虹线条
    handleMenuClick({ key }) {
      if (key === 'default-choose') {
        this.isDefault = true
        this.chooseColor = []
        return
      }
      if (typeof key === 'number') {
        this.isDefault = false
        this.chooseColor = this.rainbowColors[key]['colors']
      }
      this.minder.setRainbowConnect(this.chooseColor)
      this.minder.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.rainbow-lines-container {
  margin-top: 16px;
  .ant-btn-group::v-deep {
    button:first-child {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.rainbow-lines-wrapper {
  width: 15.5rem;
  display: flex;
  height: 14px;
  .color-one {
    flex: 1;
  }
}
</style>
