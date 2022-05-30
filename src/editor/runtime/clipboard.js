/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 */
// import { cloneDeep } from 'lodash-es'

export default function ClipboardRuntime() {
  const minder = this.minder
  const { data, Node } = window.kityminder
  const blurElement = document.querySelector('body')

  if (!minder.supportClipboardEvent || window.kity.Browser.gecko) {
    return
  }

  const MimeType = this.MimeType

  const encodeKm = MimeType.getMimeTypeProtocol('application/km')
  const { encode: _encode } = data.getRegisterProtocol('json')

  let selectedNodes = []
  let clipboardNodes = []

  const isHaveSummary = () => {
    const nodes = minder.getSelectedNodes()
    let allCommonNode = true
    nodes.forEach(e => e.type === 'summary' && (allCommonNode = false))
    return allCommonNode
  }

  /*
   * 增加对多节点赋值粘贴的处理
   */
  function encode(nodes) {
    const target = []
    for (let i = 0, l = nodes.length; i < l; i++) {
      target.push(minder.exportNode(nodes[i]))
    }
    return encodeKm(_encode(target))
  }

  // function appendChildNode(parent, child) {
  //   selectedNodes.push(child)
  //   minder.appendNode(child, parent)
  //   child.render()
  //   child.setLayoutOffset(null)
  //   const children = child.children.map(function (node) {
  //     return node.clone()
  //   })
  //   child.clearChildren()

  //   for (var i = 0, ci; (ci = children[i]); i++) {
  //     child, ci
  //   }
  // }

  function sendToClipboard(nodes) {
    if (!nodes.length) return
    nodes.sort(function (a, b) {
      return a.getIndex() - b.getIndex()
    })
    clipboardNodes = nodes.map(function (node) {
      return node.clone()
    })
  }

  const customCopy = e => {
    if (document.activeElement === blurElement && isHaveSummary()) {
      if (minder.getStatus() !== 'normal') {
        e.preventDefault()
        return
      }
      const ancestors = minder.getSelectedAncestors(true)

      if (ancestors.length === 0) return

      sendToClipboard(ancestors)
      const str = encode(clipboardNodes)
      e.clipboardData.setData('text/plain', str)

      e.preventDefault()
    }
  }

  const customCut = e => {
    if (document.activeElement === blurElement && isHaveSummary()) {
      const selected = minder.getSelectedNode()
      if (minder.getStatus() !== 'normal' || !selected || (selected && selected.isRoot())) {
        e.preventDefault()
        return
      }

      const ancestors = minder.getSelectedAncestors()

      if (ancestors.length === 0) return

      sendToClipboard(ancestors)

      minder.select(Node.getCommonAncestor(ancestors), true)

      ancestors.slice().forEach(function (node) {
        minder.removeNode(node)
      })
      minder.refresh()
      e.clipboardData.setData('text/plain', encode(clipboardNodes))
      e.preventDefault()
    }
  }

  const customPaste = e => {
    if (document.activeElement === blurElement && isHaveSummary()) {
      if (minder.getStatus() !== 'normal') {
        e.preventDefault()
        return
      }

      const clipBoardEvent = e
      const textData = clipBoardEvent.clipboardData.getData('text/plain')

      /*
       * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
       */
      const nodes = minder.getSelectedNodes()

      if (MimeType.whichMimeType(textData) === 'application/km') {
        nodes.forEach(function (node) {
          // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
          for (let i = 0; i <= clipboardNodes.length - 1; i++) {
            const n = minder.createNode(null, node)
            minder.importNode(n, clipboardNodes[i])
            selectedNodes.push(n)
            node.appendChild(n)
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
        alert('当前无图片服务器')
        return false
        // 执行上传图片的动作
        // return serverService.uploadImage(imageFile).then(function (json) {
        //   var resp = json.data
        //   if (resp.errno === 0) {
        //     minder.execCommand('image', resp.data.url)
        //   }
        // })
      } else {
        nodes.forEach(function (node) {
          minder.Text2Children(node, textData)
        })
      }
      e.preventDefault()
    }
  }
  /**
   * 由editor的receiver统一处理全部事件，包括clipboard事件
   */
  document.addEventListener('copy', customCopy)
  document.addEventListener('cut', customCut)
  document.addEventListener('paste', customPaste)
}
