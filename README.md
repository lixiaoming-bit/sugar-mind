# SugarMind

## 常见问题记录

1. 定制主题时 设置背景颜色为透明时 不能设置为 none 应当设置为 transparent
2. 上传背景时，现在只支持单种图片背景切换，即：水印 - 纯色 - 图片

## 任务汇总

### 前端

- [ ] 支持创建自由节点
- [ ] 支持创建关联线
- [ ] 支持概要连线
- [ ] 主题节点设置
  - [ ] 主题形状设置
  - [ ] 主题边框设置
  - [ ] 主题线条设置
- [ ] 大纲
  - [ ] 支持大纲的搜索、展开问题
  - [ ] 支持大纲的编辑
  - [ ] 支持大纲的拖拽
- [ ] 支持插入公式
- [ ] 当前的复制节点无法触发复制的图片、第三方文本等动作 可以直接使用键盘事件
- [ ] minimap 的展示效果不够真实，需要改变的三个层级节点的颜色，透明时使用线框展示
- [ ] 支持离线存储的功能
- [ ] 项目文档
  - [ ] 说明文档
  - [ ] 使用文档
- [ ] 图片不支持缩放调整

### 待优化

- [ ] 优化图标模块、整合所有图标模块，使用单模块控制所有图标
- [ ] 主题上的图标随着**单行文本**高度发生变化
- [ ] 图标、备注、超链接支持 tooltip
- [ ] 右侧备注、超链接大于 1 时，进行整合
- [ ] json在数据量过大时会存在递归爆栈的问题

### 后端

- [ ] 上传文件到服务器

## Bug 汇总

- [ ] bug - 按住 ctrl 滚动滚轮页面会发生滚动 -> 只控制缩放，不发生页面滚动，猜测是 document 的默认事件触发导致
- [ ] 使用键盘对字体进行加粗、倾斜的控制，此时样式页面打开，B、I 无选中状态
- [ ] 修改导图缩略器的展示效果
- [ ] bug - 安装ctrl 滚动滚轮页面会发生滚动


### 自由节点设计实现方案
- 数据格式：每个由根节点出发的数据都是一个树结构
- 数据收集：使用数组收集所有树结构
- 触发方式：右键菜单触发或者双击页面空白处

```javascript
const freedomTopic = {
  data: {
    id: '',
    created: '',
    text: '',
    // 使用e.getPosition(refer) 获取相对于中心节点的相对位置
    pos: {
      x: 123,
      y: 456
    }
  },
  children: []
}
const json = {
  freedomTopics: [
    freedomTopic
  ]
}
```
