/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 */

// import kity from 'kity'

export default function ClipboardRuntime() {
  const minder = this.minder
  const minderSource = window.kityminder.data

  if (!minder.supportClipboardEvent || window.kity.Browser.gecko) {
    return
  }

  const fsm = this.fsm
  const receiver = this.receiver
  const MimeType = this.MimeType

  const encodeKm = MimeType.getMimeTypeProtocol('application/km')
  const decode = minderSource.getRegisterProtocol('json').decode
  let selectedNodes = []

  /*
   * 增加对多节点赋值粘贴的处理
   */
  function encode(nodes) {
    const target = []
    for (let i = 0, l = nodes.length; i < l; i++) {
      target.push(minder.exportNode(nodes[i]))
    }
    return encodeKm(minderSource.getRegisterProtocol('json').encode(target))
  }

  const beforeCopy = e => {
    if (document.activeElement == receiver.element) {
      const clipBoardEvent = e
      const state = fsm.state()

      switch (state) {
        case 'input': {
          break
        }
        case 'normal': {
          const nodes = [].concat(minder.getSelectedNodes())
          if (nodes.length) {
            // 这里由于被粘贴复制的节点的id信息也都一样，故做此算法
            // 这里有个疑问，使用node.getParent()或者node.parent会离奇导致出现非选中节点被渲染成选中节点，因此使用isAncestorOf，而没有使用自行回溯的方式
            if (nodes.length > 1) {
              let targetLevel = null
              nodes.sort(function (a, b) {
                return a.getLevel() - b.getLevel()
              })
              targetLevel = nodes[0].getLevel()
              if (targetLevel !== nodes[nodes.length - 1].getLevel()) {
                const { length: len } = nodes
                let idx = 0
                let pidX = len - 1
                let pNode = nodes[pidX]

                while (pNode.getLevel() !== targetLevel) {
                  idx = 0
                  while (idx < len && nodes[idx].getLevel() === targetLevel) {
                    if (nodes[idx].isAncestorOf(pNode)) {
                      nodes.splice(pidX, 1)
                      break
                    }
                    idx++
                  }
                  pidX--
                  pNode = nodes[pidX]
                }
              }
            }
            const str = encode(nodes)
            clipBoardEvent.clipboardData.setData('text/plain', str)
          }
          e.preventDefault()
          break
        }
      }
    }
  }

  const beforeCut = e => {
    if (document.activeElement == receiver.element) {
      if (minder.getStatus() !== 'normal') {
        e.preventDefault()
        return
      }

      const clipBoardEvent = e
      const state = fsm.state()

      switch (state) {
        case 'input': {
          break
        }
        case 'normal': {
          const nodes = minder.getSelectedNodes()
          if (nodes.length) {
            clipBoardEvent.clipboardData.setData('text/plain', encode(nodes))
            minder.execCommand('removenode')
          }
          e.preventDefault()
          break
        }
      }
    }
  }

  const beforePaste = e => {
    if (document.activeElement == receiver.element) {
      if (minder.getStatus() !== 'normal') {
        e.preventDefault()
        return
      }

      const clipBoardEvent = e
      const state = fsm.state()
      const textData = clipBoardEvent.clipboardData.getData('text/plain')

      switch (state) {
        case 'input': {
          // input状态下如果格式为application/km则不进行paste操作
          if (!MimeType.isPureText(textData)) {
            e.preventDefault()
            return
          }
          break
        }
        case 'normal': {
          /*
           * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
           */
          const sNodes = minder.getSelectedNodes()

          if (MimeType.whichMimeType(textData) === 'application/km') {
            const nodes = decode(MimeType.getPureText(textData))
            let _node = null
            sNodes.forEach(function (node) {
              // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
              for (let i = nodes.length - 1; i >= 0; i--) {
                _node = minder.createNode(null, node)
                minder.importNode(_node, nodes[i])
                selectedNodes.push(_node)
                node.appendChild(_node)
              }
            })
            minder.select(selectedNodes, true)
            selectedNodes = []

            minder.refresh()
          } else if (
            clipBoardEvent.clipboardData &&
            clipBoardEvent.clipboardData.items[0].type.indexOf('image') > -1
          ) {
            const imageFile = clipBoardEvent.clipboardData.items[0].getAsFile()
            console.log('imageFile: ', imageFile)
            // 执行上传图片的动作
            // return serverService.uploadImage(imageFile).then(function (json) {
            //   var resp = json.data
            //   if (resp.errno === 0) {
            //     minder.execCommand('image', resp.data.url)
            //   }
            // })
          } else {
            sNodes.forEach(function (node) {
              minder.Text2Children(node, textData)
            })
          }
          e.preventDefault()
          break
        }
      }
    }
  }
  /**
   * 由editor的receiver统一处理全部事件，包括clipboard事件
   */
  document.addEventListener('copy', beforeCopy)
  document.addEventListener('cut', beforeCut)
  document.addEventListener('paste', beforePaste)
}
