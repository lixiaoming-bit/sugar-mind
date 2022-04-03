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
    value: '宋体, SimSun, "Songti SC"'
  },
  {
    label: '微软雅黑',
    value: '微软雅黑, "Microsoft YaHei"'
  },
  {
    label: '楷体',
    value: '楷体, 楷体_GB2312, SimKai, STKaiti'
  },
  {
    label: '黑体',
    value: '黑体, SimHei, "Heiti SC"'
  },
  {
    label: '隶书',
    value: '隶书, SimLi'
  }
]

// 英文字体
export const EN_FONT_FAMILY = [
  {
    label: 'Andale Mono',
    value: '"andale mono";'
  },
  {
    label: 'Arial',
    value: 'arial, helvetica, sans-serif;'
  },
  {
    label: 'Comic Sans Ms',
    value: '"comic sans ms";'
  },
  {
    label: 'Impact',
    value: 'impact, chicago;'
  },
  {
    label: 'Times New Roman',
    value: '"times new roman";'
  },
  {
    label: 'Sans-Serif',
    value: 'sans-serif;'
  }
]

// 字体大小
export const FONT_SIZE = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 48, 60]

// 字体图标
export const generateFontIcons = (shortcutText = 'Ctrl') => [
  {
    title: '文本字体颜色',
    icon: 'font-colors',
    command: 'color'
  },
  {
    title: `文本加粗，${shortcutText} + B`,
    icon: 'bold',
    command: 'bold'
  },
  {
    title: `文本添加倾斜，${shortcutText} + I`,
    icon: 'italic',
    command: 'italic'
  },
  {
    title: '文本添加删除线',
    icon: 'strikethrough',
    command: 'line-through'
  },
  {
    title: '文本添加下划线',
    icon: 'underline',
    command: 'underline'
  },
  {
    title: '清除样式',
    icon: 'delete',
    command: 'clear-style'
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
    class: 'disabled'
  },
  {
    key: 'summary',
    title: '概要',
    visible: false,
    tips: '选中主题-点击概要',
    icon: 'iconicon_draw_summary',
    class: 'disabled'
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

// ToolBoxTC more tooltip
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

// TOOL_BOX_TR
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

// 选择节点菜单
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

// 选中paper菜单
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

// 移除菜单选项
export const removeNodeContextmenu = handleCheckDisabled => {
  return [
    {
      key: 'remove-priority',
      title: '移除图标：优先级',
      description: '',
      command: 'priority',
      disabled: handleCheckDisabled('priority')
    },
    {
      key: 'remove-progress',
      title: '移除图标：进度条',
      description: '',
      command: 'progress',
      disabled: handleCheckDisabled('progress')
    },
    {
      key: 'remove-emoji',
      title: '移除图标：表情',
      description: '',
      command: 'emoji',
      disabled: handleCheckDisabled('emoji')
    },
    {
      key: 'remove-mark',
      title: '移除图标：标记',
      description: '',
      command: 'mark',
      disabled: handleCheckDisabled('mark')
    },
    {
      key: 'remove-note',
      title: '移除：备注',
      description: '',
      command: 'note',
      disabled: handleCheckDisabled('note')
    },
    {
      key: 'remove-image',
      title: '移除：图片',
      description: '',
      command: 'image',
      disabled: handleCheckDisabled('image')
    }
  ]
}

// 快速菜单选项

export const QUICK_INSERT_CONTEXTMENU = [
  {
    key: 'insert-note',
    title: '备注',
    description: '',
    modal: 'InsertNotesModal'
  },
  {
    key: 'insert-image',
    title: '图片',
    description: '',
    modal: 'InsertImagesModal'
  },
  {
    key: 'insert-icon',
    title: '图标',
    description: '',
    modal: 'InsertIconsModal'
  },
  {
    key: 'insert-url',
    title: '超链接',
    description: '',
    modal: 'InsertUrlModal'
  }
]

// 展开菜单选项
export const EXPAND_TO_MENUS = [
  // {
  //   key: 'remove-priority',
  //   title: '移除图标：优先级',
  //   description: '',
  //   command: 'priority',
  //   disabled: handleCheckDisabled('priority')
  // }
]

// 导出文档的格式
export const EXPORT_TYPE_LIST = [
  {
    key: 'png',
    title: '超清PNG图片',
    disabled: false
  },
  {
    key: 'pdf',
    title: 'PDF 文档',
    disabled: false
  },
  {
    key: 'word',
    title: 'Word 文档',
    disabled: true
  },
  {
    key: 'excel',
    title: 'Excel 文档',
    disabled: true
  },
  {
    key: 'markdown',
    title: 'Markdown 文档',
    disabled: false
  },
  {
    key: 'xmind',
    title: 'Xmind 文档（.xmind)',
    disabled: true
  }
]

// 快捷键操作列表
export const generateShortModalContext = (shortcutText = 'Ctrl', optionText = 'Alt') => {
  // alt对应option  ctrl对应command
  // eslint-disable-next-line prettier/prettier
  return [
    {
      title: '主题操作',
      contents: [
        {
          key: 'insert-the-next-topic',
          icon: 'iconicon_shortcuts_1',
          title: '插入下级主题',
          description: 'Tab'
        },
        {
          key: 'append-before',
          icon: 'iconicon_shortcuts_2',
          title: '插入同级主题',
          description: 'Enter'
        },
        {
          key: 'append-before',
          icon: 'iconicon_shortcuts_3',
          title: '插入上级主题',
          description: 'Tab'
        },
        {
          key: 'enter-the-editor',
          icon: 'iconicon_shortcuts_edit',
          title: '进入编辑',
          description: 'Space空格键'
        },
        {
          key: 'expand-collaborate-theme',
          icon: 'iconicon_shortcuts_4',
          title: '展开/收起主题',
          description: `${shortcutText} + / `
        },
        {
          key: 'one-button-launch-collaborative',
          icon: 'iconicon_draw_keyboard_unfold',
          title: '一键展开/收起主题',
          description: `${optionText} + ${shortcutText} + /`
        },
        {
          key: 'move-the-subject',
          icon: 'iconicon_shortcuts_5',
          title: '上移主题',
          description: `${optionText} + ↑`
        },
        {
          key: 'migration-theme',
          icon: 'iconicon_shortcuts_6',
          title: '下移主题',
          description: `${optionText} + ↓`
        },
        {
          key: 'theme-navigation',
          icon: 'iconicon_shortcuts_7',
          title: '主题导航',
          description: '↑/↓/←/→'
        },
        {
          key: 'find-replacement',
          icon: 'iconoutline_input_search',
          title: '查找替换',
          description: `${shortcutText} + F`
        }
      ]
    },
    // {
    //   title: '大纲操作',
    //   contents: [{
    //       key: 'append-sibling',
    //       icon: 'iconicon_shortcuts_outline_add',
    //       title: '新增同级文本',
    //       description: 'Enter'
    //     },
    //     {
    //       key: 'append-before',
    //       icon: 'iconicon_shortcuts_outline_right',
    //       title: '向右缩进',
    //       description: 'Tab'
    //     },
    //     {
    //       key: 'append-sibling',
    //       icon: 'iconicon_shortcuts_outline_left',
    //       title: '取消缩进',
    //       description: 'Shift+Tab'
    //     }
    //   ]
    // },
    {
      title: '画布操作',
      contents: [
        {
          key: 'large-drawing',
          icon: 'iconicon_shortcuts_8',
          title: '放大画布',
          description: `${shortcutText} + "+"`
        },
        {
          key: 'shrink',
          icon: 'iconicon_shortcuts_9',
          title: '缩小画布',
          description: `${shortcutText} + "-"`
        },
        {
          key: 'drag',
          icon: 'iconicon_shortcuts_10',
          title: '拖动画布',
          description: '按住鼠标右键'
        }
      ]
    },
    {
      title: '编辑操作',
      contents: [
        {
          key: 'action-save',
          icon: 'iconicon_shortcuts_save',
          title: '保存',
          description: `${shortcutText} + S`
        },
        {
          key: 'action-reset',
          icon: 'iconicon_shortcuts_11',
          title: '撤销',
          description: `${shortcutText} + Z`
        },
        {
          key: 'action-recover',
          icon: 'iconicon_shortcuts_12',
          title: '恢复',
          description: `${shortcutText} + Y`
        },
        {
          key: 'action-enter',
          icon: 'iconicon_shortcuts_13',
          title: '换行',
          description: 'Shift+Enter'
        },
        {
          key: 'action-multiple-choice',
          icon: 'iconicon_draw_keyboard_multipleselect1',
          title: '多选',
          description: `${shortcutText} + 鼠标左键点击`
        },
        {
          key: 'action-same-selection',
          icon: 'iconicon_draw_keyboard_continuousselect',
          title: '同级连选',
          description: 'Shift+鼠标左键点击'
        },
        {
          key: 'action-bold',
          icon: 'iconicon_shortcuts_14',
          title: '加粗',
          description: `${shortcutText} + B`
        },
        {
          key: 'action-italic',
          icon: 'iconicon_font-style_3',
          title: '斜体',
          description: `${shortcutText} + I`
        },
        {
          key: 'action-select-all',
          icon: 'iconicon_shortcuts_16',
          title: '全选',
          description: `${shortcutText} + A`
        },
        {
          key: 'action-copy',
          icon: 'iconicon_shortcuts_17',
          title: '复制',
          description: `${shortcutText} + C`
        },
        {
          key: 'action-cut',
          icon: 'iconicon_shortcuts_18',
          title: '剪切',
          description: `${shortcutText} + X`
        },
        {
          key: 'action-paste',
          icon: 'iconicon_shortcuts_19',
          title: '粘贴',
          description: `${shortcutText} + V`
        },
        {
          key: 'action-delete',
          icon: 'iconicon_home_recovery',
          title: '删除',
          description: 'Delete'
        }
      ]
    }
  ]
}

// 样式选择的默认设置
export const NODE_FONT_STYLE_SETTING = {
  fontFamily: '微软雅黑, "Microsoft YaHei"',
  fontSize: null,
  color: '',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none'
}

// 彩虹线条
export const RAINBOW_COLORS = [
  {
    title: '主题1',
    colors: ['#ffd549', '#ff887e', '#6be18d', '#97abff', '#81dcf2', '#ffa37d', '#9884ea']
  },
  {
    title: '主题2',
    colors: ['#f85d5d', '#ff9754', '#ffd645', '#49cd8c', '#40c0ff', '#546ed6', '#a45ddc']
  },
  {
    title: '主题3',
    colors: ['#8cf0e7', '#4ad2ff', '#41a8f3', '#3180cd', '#bce284', '#71d77b', '#78bf6d']
  },
  {
    title: '主题4',
    colors: ['#a96263', '#f57d7b', '#feb7a8', '#fbdaab', '#8aa3b5', '#837fa1', '#54538c']
  },
  {
    title: '主题5',
    colors: ['#ffe58e', '#fe9e29', '#f8772c', '#e85250', '#b64262', '#633663', '#412852']
  },
  {
    title: '主题6',
    colors: ['#abe3d1', '#6bc9c4', '#37aaa9', '#128783', '#4a8ba6', '#4b6996', '#394b85']
  }
]
