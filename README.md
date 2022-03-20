# sugar-mind

## 第一阶段任务
- [x] 支持节点新增
- [x] 支持节点编辑
- [x] 支持节点删除
- [x] 支持节点拖拽
- [x] 支持dom节点的插入
- [x] 支持插入备注
- [x] 支持插入图片
  - [ ] 可以将粘贴板中的图片快速粘贴上传
  - [ ] 上传图片到服务器
  - [x] 增加图片删除
  - [ ] 图片大小缩放更改
- [x] 支持插入图标
- [x] 支持插入超链接
- [ ] 支持插入公式
- [ ] 支持修改背景图片
- [ ] 支持背景添加水印
- [ ] 支持复制粘贴样式
- [x] 支持撤销操作
- [x] 支持导出svg，png图片等
- [x] 支持导航器
- [x] 支持定位聚焦
- [x] 支持缩略图
- [x] 支持放大缩小
- [x] 支持案件键盘功能
- [x] 至少支持一种经典风格
  - [ ] 支持子节点样式调整
- [x] 至少支持一种布局方式
  - [x] 支持双向经典布局
  - [x] 支持单向经典布局
- [x] 支持统计字数与节点数目
- [ ] 支持自由节点
- [x] 左键操作菜单
  - [x] 选择节点时
    - [x] 插入同级主题
    - [x] 插入下级主题
    - [x] 插入上级主题
    - [ ] 创建关联线
    - [x] 复制
    - [x] 粘贴
    - [x] 剪切
    - [x] 删除
  - [x] 选择画布时
    - [ ] 创建自由主题
    - [x] 回到视图中心
    - [ ] 展开主题到指定层级
    - [x] 收起主题
    - [ ] 一键紧凑
    - [x] 一键整理布局
- [ ] 文字选中操作菜单
- [x] 支持自由拖拽
  - [ ] 增加是否允许自由拖拽的设置
  - [x] 设置自由拖拽时 需要在左键菜单支持一键 整理 格式的操作
- [ ] 支持自由节点数据
- [ ] 支持数据本地保存
- [ ] 支持更换背景图片
- [x] 支持选中根节点时删除子节点
- [ ] 修改脑图线条形状
- [ ] 支持关联线
- [ ] 支持概要
- [x] 支持全屏
  - [-] 沉浸模式待完善, 需要在操作节点时 使节点在屏幕中心，或者在缩放节点时，使节点在屏幕中心
- [x] 备注在缩放后 系数没有发生变化
- [x] 插入dom节点后文件导出失败
- [x] 增加菜单 移除 图标 | 备注 | 图片 | 链接
  - [x] 修改当前二级菜单的样式
  - [x] 需要增加删除图片、备注、链接
- [x] 键盘有些时候失去焦点时触发不及时的问题
- [ ] 移除右键拖拽过程中会触发的 菜单打开事件
- [ ] 插入链接的时候读取剪贴板内的内容 把校验成链接的 文档都罗列在待选项下方
- [x] 页面节点在首次加载完成 customCanvas 没有完成初始化动作
- [x] 复制节点 id 是否会重复的问题
- [x] 拖拽时键盘事件可以触发的问题
- [x] 修复粘贴文本在编辑器内出现换行的问题
- [x] 无法直接粘贴文本到节点的问题
- [x] 无法直接粘贴其他工具直接粘贴图片的问题
- [x] 解决大纲匹配选择定位问题
  - [ ] 支持大纲搜索
  - [ ] 支持大纲编辑
  - [ ] 支持大纲拖拽 
- [ ] 
## 第二阶段任务
- [ ] 改造图片预览功能
- [ ] 技术改造 改造原先Class的写法
- [ ] 重写工具类库
- [ ] 支持多人协作
- [ ] 支持多版本导入导出
- [ ] 支持多个模板、主题


## 常见问题记录
1. 定制主题时 设置背景颜色为透明时 不能设置为none 应当设置为transparent
