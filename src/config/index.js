import { levelIcons, emojiIcons, processIcons, markIcons } from '@/assets/images'
// 图标列表
export const ICONS = [
  {
    type: 'priority',
    title: '优先级图标',
    urls: levelIcons
  },
  {
    type: 'progress',
    title: '进度条图标',
    urls: processIcons
  },
  {
    type: 'emoji',
    title: '表情图标',
    urls: emojiIcons
  },
  {
    type: 'mark',
    title: '标记图标',
    urls: markIcons
  }
]

// 中文字体
export const CN_FONT_FAMILY = [
  {
    label: '宋体',
    value: 'font-family: 宋体, SimSun, "Songti SC";'
  },
  {
    label: '微软雅黑',
    value: 'font-family: 微软雅黑, "Microsoft YaHei";'
  },
  {
    label: '楷体',
    value: 'font-family: 楷体, 楷体_GB2312, SimKai, STKaiti;'
  },
  {
    label: '黑体',
    value: 'font-family: 黑体, SimHei, "Heiti SC";'
  },
  {
    label: '隶书',
    value: 'font-family: 隶书, SimLi;'
  }
]

// 英文字体
export const EN_FONT_FAMILY = [
  {
    label: 'Andale Mono',
    value: 'font-family: "andale mono";'
  },
  {
    label: 'Arial',
    value: 'font-family: arial, helvetica, sans-serif;'
  },
  {
    label: 'Comic Sans Ms',
    value: 'font-family: "comic sans ms";'
  },
  {
    label: 'Impact',
    value: 'font-family: impact, chicago;'
  },
  {
    label: 'Times New Roman',
    value: 'font-family: "times new roman";'
  },
  {
    label: 'Sans-Serif',
    value: 'font-family: sans-serif;'
  }
]

// 字体大小
export const FONT_SIZE = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 48, 60]

// 字体图标
export const generateFontIcons = (shortcutText = 'Ctrl') => [
  {
    title: '文本设置字体颜色',
    icon: 'font-colors'
  },
  {
    title: `文本加粗，${shortcutText} + B`,
    icon: 'bold'
  },
  {
    title: `文本添加倾斜，${shortcutText} + I`,
    icon: 'italic'
  },
  {
    title: '文本添加删除线',
    icon: 'strikethrough'
  },
  {
    title: '文本添加下划线',
    icon: 'underline'
  },
  {
    title: '清除样式',
    icon: 'delete'
  }
]
// 字体设置排班图标
export const FONT_ALIGN_ICONS = [
  {
    title: '文本左对齐',
    icon: 'align-left'
  },
  {
    title: '文本居中',
    icon: 'align-center'
  },
  {
    title: '文本右对齐',
    icon: 'align-right'
  }
]

// ToolBoxTC tooltip
export const generateToolBoxTopCenterOptions = (handleCheckDisabled, shortcutText = 'Ctrl') => [
  {
    key: 'undo',
    title: '撤回',
    visible: false,
    tips: `快捷操作：${shortcutText} + Z`,
    icon: 'iconicon_draw_revocation',
    class: handleCheckDisabled('historyundo')
  },
  {
    key: 'redo',
    title: '恢复',
    visible: false,
    tips: `快捷操作：${shortcutText} + Y`,
    icon: 'iconicon_draw_recovery',
    class: handleCheckDisabled('historyredo')
  },
  {
    key: 'copy-style',
    title: '格式刷',
    visible: false,
    tips: '选中主题-点格式刷-点其他主题',
    icon: 'iconicon_draw_brush',
    class: handleCheckDisabled('copystyle')
  },
  {
    key: 'append-sibling',
    title: '主题',
    visible: false,
    tips: '添加同级主题（Enter）',
    icon: 'iconicon_draw_topic',
    class: handleCheckDisabled('AppendSiblingNode')
  },
  {
    key: 'append-child',
    title: '子主题',
    visible: false,
    tips: '添加下级主题（Tab）',
    icon: 'iconicon_draw_subtheme',
    class: handleCheckDisabled('AppendChildNode')
  },
  {
    key: 'connect',
    title: '关联线',
    visible: false,
    tips: '选择主题-点关联线-点其他主题',
    icon: 'iconicon_draw_association',
    class: handleCheckDisabled('ConnectionNode')
  },
  {
    key: 'summary',
    title: '概要',
    visible: false,
    tips: '选中主题-点击概要',
    icon: 'iconicon_draw_summary',
    class: handleCheckDisabled('AppendChildNode')
  },
  {
    key: 'note',
    title: '备注',
    visible: false,
    tips: '用于注释主题的文本',
    icon: 'iconicon_draw_remark',
    class: handleCheckDisabled('note')
  },
  {
    key: 'image',
    title: '图片',
    visible: false,
    tips: '图文并茂',
    icon: 'iconicon_draw_photo',
    class: handleCheckDisabled('Image')
  },
  {
    key: 'priority',
    title: '图标',
    visible: false,
    tips: '表达优先级、进度、心情等',
    icon: 'iconicon_draw_emoji',
    class: handleCheckDisabled('priority')
  }
]
export const generateToolBoxTopCenterMoreOptions = handleCheckDisabled => [
  {
    key: 'hyperlink',
    icon: 'iconicon_draw_link',
    title: '超链接',
    class: handleCheckDisabled('HyperLink')
  },
  {
    key: 'matrix',
    icon: 'iconicon_draw_more_math',
    title: '公式',
    class: handleCheckDisabled('Matrix')
  }
]

//  ToolBoxTR tooltip
export const generateToolBoxTopRightOptions = (shortcutText = 'Ctrl') => [
  {
    icon: 'iconicon_draw_save',
    title: '保存',
    tips: `手动保存：${shortcutText} + S`,
    command: 'save'
  },
  {
    icon: 'iconicon_draw_export',
    title: '导出',
    tips: '导出高清晰度文件',
    command: 'export'
  }
]

export const TOOL_BOX_TR = [
  {
    icon: 'iconicon_draw_tool_share_key',
    title: '链接分享',
    command: 'share'
  },
  {
    icon: 'iconicon_draw_tool_share_team',
    title: '多人协作',
    command: 'cooperation'
  },
  {
    icon: 'iconicon_draw_tool_share_template',
    title: '发布模板',
    command: 'minder-template'
  }
]

// ToolBoxMR tooltip
export const TOOL_BOX_MR = [
  {
    icon: 'iconicon_draw_style',
    title: '风格',
    tips: '一键切换好看的风格',
    component: 'ThemeStyleModal'
  },
  {
    icon: 'iconicon_draw_format_new',
    title: '样式',
    tips: '选中主题-个性化每一个元素',
    component: 'NodeStyleModal'
  },
  {
    icon: 'iconicon_draw_canvas',
    title: '画布',
    tips: '切换结构、背景',
    component: 'CanvasStructModal'
  },
  {
    icon: 'iconicon_draw_outline',
    title: '大纲',
    tips: '大纲编辑文本',
    component: 'SynopsisModal'
  }
]

export const generateSelectedNodeContextmenu = (handleCheckDisabled, shortcutText = 'Ctrl') => {
  return [
    {
      key: 'append-sibling',
      title: '插入同级主题',
      description: 'Enter',
      command: 'AppendSiblingNode',
      disabled: handleCheckDisabled('AppendSiblingNode')
    },
    {
      key: 'append-child',
      title: '插入下级主题',
      description: 'Tab',
      command: 'AppendChildNode',
      disabled: handleCheckDisabled('AppendChildNode')
    },
    {
      key: 'append-before',
      title: '插入上级主题',
      description: 'Shift + Tab',
      command: 'AppendParentNode',
      disabled: handleCheckDisabled('AppendParentNode')
    },
    {
      key: 'cut',
      title: '剪切',
      description: `${shortcutText} + X`,
      command: 'cut',
      disabled: handleCheckDisabled('cut')
    },
    {
      key: 'copy',
      title: '复制',
      description: `${shortcutText} + C`,
      command: 'copy',
      disabled: handleCheckDisabled('copy')
    },
    {
      key: 'paste',
      title: '粘贴',
      description: `${shortcutText} + V`,
      command: 'paste',
      disabled: handleCheckDisabled('paste')
    },
    {
      key: 'connect',
      title: '创建关联线',
      description: '',
      disabled: true
    },
    {
      key: 'delete',
      title: '删除主题',
      description: 'Backspace [回车]',
      command: 'RemoveNode',
      disabled: handleCheckDisabled('RemoveNode')
    },
    {
      key: 'delete-current',
      title: '仅删除当前节点',
      description: `${shortcutText} + Backspace [回车]`,
      command: 'RemoveCurrentNode',
      disabled: handleCheckDisabled('RemoveCurrentNode')
    }
  ]
}

export const generateSelectedPaperContextmenu = (
  handleCheckDisabled,
  shortcutText = 'Ctrl',
  optionText = 'Alt'
) => {
  return [
    {
      key: 'paste',
      title: '粘贴',
      description: `${shortcutText} + V`,
      command: 'paste',
      disabled: handleCheckDisabled('paste')
    },
    {
      key: 'freedom-node',
      title: '自由主题',
      description: '鼠标双击画布',
      disabled: true
    },
    {
      key: 'camera',
      title: '回到主题中心',
      description: '',
      command: 'camera'
    },
    {
      key: 'compact',
      title: '一键紧凑模式',
      disabled: true
    },
    {
      key: 'layout',
      title: '一键整理布局',
      description: `${shortcutText} + Shift + L`,
      command: 'resetlayout'
    },
    {
      key: 'expand-all',
      title: '展开 / 收起所有主题',
      description: `${shortcutText} + ${optionText} + /`,
      command: 'expandtolevel'
    }
  ]
}

export const EXPORT_TYPE_LIST = [
  {
    key: 'png',
    title: '图片 文档（.png)'
  },
  {
    key: 'pdf',
    title: 'PDF 文档（.pdf)'
  },
  {
    key: 'word',
    title: 'Word 文档（.docx)'
  },
  {
    key: 'excel',
    title: 'Excel 文档（.xlsx)'
  },
  {
    key: 'markdown',
    title: 'Markdown 文档（.md)'
  },
  {
    key: 'xmind',
    title: 'Xmind 文档（.xmind)'
  }
]
