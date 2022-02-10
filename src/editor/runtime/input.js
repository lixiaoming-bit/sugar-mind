/**
 * 文本输入支持
 */
// import kity from 'kity'
import Debug from '../tool/debug'
import polyfillInnerText from '../tool/inner-text'
polyfillInnerText()

const debug = new Debug('input')

export default function InputRuntime() {
  let fsm = this.fsm
  let minder = this.minder
  let hotbox = this.hotbox
  let receiver = this.receiver
  let receiverElement = receiver.element
  let isGecko = window.kity.Browser.gecko

  // setup everything to go
  setupReceiverElement()
  setupFsm()
  setupHotbox()

  // expose editText()
  this.editText = editText

  // listen the fsm changes, make action.
  function setupFsm() {
    // when jumped to input mode, enter
    fsm.when('* -> input', enterInputMode)

    // when exited, commit or exit depends on the exit reason
    fsm.when('input -> *', function (exit, enter, reason) {
      switch (reason) {
        case 'input-cancel':
          return exitInputMode()
        case 'input-commit':
        default:
          return commitInputResult()
      }
    })

    // lost focus to commit
    receiver.onblur(function () {
      if (fsm.state() == 'input') {
        fsm.jump('normal', 'input-commit')
      }
    })

    minder.on('beforemousedown', function () {
      if (fsm.state() == 'input') {
        fsm.jump('normal', 'input-commit')
      }
    })

    minder.on('dblclick', function () {
      if (minder.getSelectedNode() && minder._status !== 'readonly') {
        editText()
      }
    })
  }

  // let the receiver follow the current selected node position
  function setupReceiverElement() {
    if (debug.isFlag) {
      receiverElement.classList.add('debug')
    }

    receiverElement.onmousedown = function (e) {
      e.stopPropagation()
    }

    minder.on('layoutallfinish viewchange viewchanged selectionchange', function (e) {
      // viewchange event is too frequented, lazy it
      if (e.type == 'viewchange' && fsm.state() != 'input') return

      updatePosition()
    })

    updatePosition()
  }

  // edit entrance in hotbox
  function setupHotbox() {
    hotbox.state('main').button({
      position: 'center',
      label: '编辑',
      key: 'F2',
      enable: function () {
        return minder.queryCommandState('text') != -1
      },
      action: editText
    })
  }

  /**
   * 增加对字体的鉴别，以保证用户在编辑状态ctrl/cmd + b/i所触发的加粗斜体与显示一致
   */
  function editText() {
    const node = minder.getSelectedNode()
    if (!node) {
      return
    }
    let textContainer = receiverElement
    receiverElement.innerText = ''
    if (node.getData('font-weight') === 'bold') {
      const b = document.createElement('b')
      textContainer.appendChild(b)
      textContainer = b
    }
    if (node.getData('font-style') === 'italic') {
      const i = document.createElement('i')
      textContainer.appendChild(i)
      textContainer = i
    }
    textContainer.innerText = minder.queryCommandValue('text')

    if (isGecko) {
      receiver.fixFFCaretDisappeared()
    }
    fsm.jump('input', 'input-request')
    receiver.selectAll()
  }

  /**
   * 增加对字体的鉴别，以保证用户在编辑状态ctrl/cmd + b/i所触发的加粗斜体与显示一致
   */
  function enterInputMode() {
    const node = minder.getSelectedNode()
    if (node) {
      const fontSize = node.getData('font-size') || node.getStyle('font-size')
      receiverElement.style.fontSize = fontSize + 'px'
      receiverElement.style.minWidth = 0
      receiverElement.style.minWidth = receiverElement.clientWidth + 'px'
      receiverElement.style.fontWeight = node.getData('font-weight') || ''
      receiverElement.style.fontStyle = node.getData('font-style') || ''
      receiverElement.classList.add('input')
      receiverElement.focus()
    }
  }

  /**
   * 按照文本提交操作处理
   * 从其他节点复制文字到另一个节点时部分浏览器(chrome)会自动包裹一个span标签，这样试用一下逻辑出来的就不是text节点二是span节点因此导致undefined的情况发生
   */
  function commitInputText(textNodes) {
    let text = ''
    const TAB_CHAR = '\t'
    const ENTER_CHAR = '\n'
    const STR_CHECK = /\S/
    const SPACE_CHAR = '\u0020'
    // 针对FF,SG,BD,LB,IE等浏览器下SPACE的charCode存在为32和160的情况做处理
    const SPACE_CHAR_REGEXP = new RegExp('(\u0020|' + String.fromCharCode(160) + ')')
    const BR = document.createElement('br')
    let isBold = false
    let isItalic = false

    for (let i = 0, l = textNodes.length; i < l; i++) {
      let str = textNodes[i]
      let _divChildNodes
      let space_l

      switch (Object.prototype.toString.call(str)) {
        // 正常情况处理
        case '[object HTMLBRElement]': {
          text += ENTER_CHAR
          break
        }
        case '[object Text]': {
          // SG下会莫名其妙的加上&nbsp;影响后续判断，干掉！
          /**
           * FF下的wholeText会导致如下问题：
           *     |123| -> 在一个节点中输入一段字符，此时TextNode为[#Text 123]
           *     提交并重新编辑，在后面追加几个字符
           *     |123abc| -> 此时123为一个TextNode为[#Text 123, #Text abc]，但是对这两个任意取值wholeText均为全部内容123abc
           * 上述BUG仅存在在FF中，故将wholeText更改为textContent
           */
          str = str.textContent.replace('&nbsp;', ' ')

          if (!STR_CHECK.test(str)) {
            space_l = str.length
            while (space_l--) {
              if (SPACE_CHAR_REGEXP.test(str[space_l])) {
                text += SPACE_CHAR
              } else if (str[space_l] === TAB_CHAR) {
                text += TAB_CHAR
              }
            }
          } else {
            text += str
          }
          break
        }
        // ctrl + b/i 会给字体加上<b>/<i>标签来实现黑体和斜体
        case '[object HTMLElement]': {
          switch (str.nodeName) {
            case 'B':
              isBold = true
              break

            case 'I':
              isItalic = true
              break
          }
          ;[].splice.apply(textNodes, [i, 1].concat([].slice.call(str.childNodes)))
          l = textNodes.length
          i--
          break
        }
        // 被增加span标签的情况会被处理成正常情况并会推交给上面处理
        case '[object HTMLSpanElement]': {
          ;[].splice.apply(textNodes, [i, 1].concat([].slice.call(str.childNodes)))
          l = textNodes.length
          i--
          break
        }
        // 若标签为image标签，则判断是否为合法url，是将其加载进来
        case '[object HTMLImageElement]': {
          if (str.src) {
            if (/http(|s):\/\//.test(str.src)) {
              minder.execCommand('Image', str.src, str.alt)
            } else {
              // data:image协议情况
              // 上传至服务器
            }
          }
          break
        }
        // 被增加div标签的情况会被处理成正常情况并会推交给上面处理
        case '[object HTMLDivElement]': {
          _divChildNodes = []
          for (let di = 0, l = str.childNodes.length; di < l; di++) {
            _divChildNodes.push(str.childNodes[di])
          }
          _divChildNodes.push(BR)
          ;[].splice.apply(textNodes, [i, 1].concat(_divChildNodes))
          l = textNodes.length
          i--
          break
        }
        default: {
          if (str && str.childNodes.length) {
            _divChildNodes = []
            for (let di = 0, l = str.childNodes.length; di < l; di++) {
              _divChildNodes.push(str.childNodes[di])
            }
            _divChildNodes.push(BR)
            ;[].splice.apply(textNodes, [i, 1].concat(_divChildNodes))
            l = textNodes.length
            i--
          } else {
            if (str && str.textContent !== undefined) {
              text += str.textContent
            } else {
              text += ''
            }
          }
          // // 其他带有样式的节点被粘贴进来，则直接取textContent，若取不出来则置空
        }
      }
    }

    text = text.replace(/^\n*|\n*$/g, '')
    text = text.replace(
      new RegExp('(\n|\r|\n\r)(\u0020|' + String.fromCharCode(160) + '){4}', 'g'),
      '$1\t'
    )
    minder.getSelectedNode().setText(text)
    if (isBold) {
      minder.queryCommandState('bold') || minder.execCommand('bold')
    } else {
      minder.queryCommandState('bold') && minder.execCommand('bold')
    }

    if (isItalic) {
      minder.queryCommandState('italic') || minder.execCommand('italic')
    } else {
      minder.queryCommandState('italic') && minder.execCommand('italic')
    }
    exitInputMode()
    return text
  }

  /**
   * 判断节点的文本信息是否是
   * @Desc: 从其他节点复制文字到另一个节点时部分浏览器(chrome)会自动包裹一个span标签，这样使用以下逻辑出来的就不是text节点二是span节点因此导致undefined的情况发生
   * @Notice: 此处逻辑应该拆分到 kityminder-core/core/data中去，单独增加一个对某个节点importJson的事件
   */
  function commitInputNode(node, text) {
    try {
      minder.decodeData('text', text).then(function (json) {
        function importText(node, json, minder) {
          const data = json.data

          node.setText(data.text || '')

          const childrenTreeData = json.children || []
          for (let i = 0; i < childrenTreeData.length; i++) {
            const childNode = minder.createNode(null, node)
            importText(childNode, childrenTreeData[i], minder)
          }
          return node
        }
        importText(node, json, minder)
        minder.fire('contentchange')
        minder.getRoot().renderTree()
        minder.layout(300)
      })
    } catch (e) {
      minder.fire('contentchange')
      minder.getRoot().renderTree()

      // 无法被转换成脑图节点则不处理
      if (e.toString() !== 'Error: Invalid local format') {
        throw e
      }
    }
  }

  function commitInputResult() {
    /**
     *  根据用户的输入判断是否生成新的节点
     */
    let textNodes = [].slice.call(receiverElement.childNodes)

    /**
     * 增加setTimeout的原因：ie下receiverElement.innerHTML=""会导致后
     * 面commitInputText中使用textContent报错，不要问我什么原因！
     */
    setTimeout(function () {
      // 解决过大内容导致SVG窜位问题
      receiverElement.innerHTML = ''
    }, 0)
    const node = minder.getSelectedNode()

    textNodes = commitInputText(textNodes)
    commitInputNode(node, textNodes)

    if (node.type == 'root') {
      const rootText = minder.getRoot().getText()
      minder.fire('initChangeRoot', { text: rootText })
    }
  }

  function exitInputMode() {
    receiverElement.classList.remove('input')
    receiver.selectAll()
  }

  function updatePosition() {
    const planed = updatePosition

    const focusNode = minder.getSelectedNode()
    if (!focusNode) return

    if (!planed.timer) {
      planed.timer = setTimeout(function () {
        const box = focusNode.getRenderBox('TextRenderer')
        receiverElement.style.left = Math.round(box.x) + 'px'
        receiverElement.style.top =
          (debug.isFlag ? Math.round(box.bottom + 30) : Math.round(box.y)) + 'px'
        //receiverElement.focus();
        planed.timer = 0
      })
    }
  }
}
