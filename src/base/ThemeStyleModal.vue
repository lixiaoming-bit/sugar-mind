<template>
  <transition name="slide-fade-left">
    <div class="theme-style-modal-container">
      <basic-modal title="风格">
        <template slot="content">
          <div class="theme-style-wrapper">
            <div
              class="style-title-wrapper"
              :style="{ '--scroll-line': `${35 + selectedStyleTab * 100}px` }"
            >
              <div
                :key="item.id"
                class="style-title"
                v-for="item in themeStyles"
                @click="selectedStyleTab = item.id"
                :class="{ 'is-active': item.id === selectedStyleTab }"
              >
                {{ item.title }}
              </div>
              <div class="scroll-line"></div>
            </div>
            <div class="style-body">
              <a-row type="flex" :gutter="[16, 16]">
                <a-col :span="12" v-for="item in selectedStyleList" :key="item.id">
                  <img :src="item.url" />
                </a-col>
              </a-row>
            </div>
          </div>
        </template>
      </basic-modal>
    </div>
  </transition>
</template>

<script>
import BasicModal from './BasicModal'
import { themeClassical, themeDarkness, themeDrawPaint } from '@/assets/images'
export default {
  name: 'ThemeStyleModal',
  filters: {},
  components: {
    BasicModal
  },
  props: {},
  data() {
    return {
      selectedStyleTab: 0
    }
  },
  computed: {
    themeStyles() {
      return [
        {
          id: 0,
          title: '经典'
        },
        {
          id: 1,
          title: '深色'
        },
        {
          id: 2,
          title: '手绘'
        }
      ]
    },
    themeClassical() {
      return themeClassical
    },
    selectedStyleList() {
      const all = [themeClassical, themeDarkness, themeDrawPaint]
      const target = Array.from(all[this.selectedStyleTab], (item, index) => {
        return {
          id: index,
          url: item
        }
      })
      return target
    }
  },
  watch: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>

<style scoped lang="less">
.theme-style-modal-container {
  position: fixed;
  right: 10px;
  bottom: 80px;
  width: 340px;
  top: 100px;
  z-index: 2;
  box-shadow: 0 2px 16px 0 #0000000f;
  .theme-style-wrapper {
    padding: 16px 8px;
    .style-title-wrapper {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-around;
      .is-active {
        color: #2cce51;
      }
      .style-title {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
      .scroll-line {
        position: absolute;
        width: 30px;
        height: 3px;
        background-color: #2cce51;
        bottom: -10px;
        left: var(--scroll-line);
        transition: left 0.25s linear;
      }
    }
    .style-body {
      margin: 20px 0px;
      padding: 0 5px;
      img {
        cursor: pointer;
        max-width: 100%;
      }
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
  transform: translateX(100%);
  opacity: 0;
}
</style>
