import data from '../core/data'
const LINE_ENDING_SPLITTER = /\r\n|\r|\n/
const EMPTY_LINE = ''
const NOTE_MARK_START = '<!--Note-->'
const NOTE_MARK_CLOSE = '<!--/Note-->'

function encode(json) {
  return _build(json, 1).join('\n')
}

function _build(node, level) {
  let lines = []

  level = level || 1

  const sharps = _generateHeaderSharp(level)
  lines.push(sharps + ' ' + node.data.text)
  lines.push(EMPTY_LINE)

  let note = node.data.note
  if (note) {
    const hasSharp = /^#/.test(note)
    if (hasSharp) {
      lines.push(NOTE_MARK_START)
      note = note.replace(/^#+/gm, function ($0) {
        return sharps + $0
      })
    }
    lines.push(note)
    if (hasSharp) {
      lines.push(NOTE_MARK_CLOSE)
    }
    lines.push(EMPTY_LINE)
  }

  if (node.children)
    node.children.forEach(function (child) {
      lines = lines.concat(_build(child, level + 1))
    })

  return lines
}

function _generateHeaderSharp(level) {
  let sharps = ''
  while (level--) sharps += '#'
  return sharps
}

function* values(v) {
  for (;;) yield v
}

function decode(markdown) {
  let parentMap = {}
  let [lines, line, lineInfo, level, node, noteProgress, codeBlock] = values(undefined)

  // 一级标题转换 `{title}\n===` => `# {title}`
  markdown = markdown.replace(/^(.+)\n={3,}/, function ($0, $1) {
    return '# ' + $1
  })

  lines = markdown.split(LINE_ENDING_SPLITTER)

  // 按行分析
  for (let i = 0; i < lines.length; i++) {
    line = lines[i]

    lineInfo = _resolveLine(line)

    // 备注标记处理
    if (lineInfo.noteClose) {
      noteProgress = false
      continue
    } else if (lineInfo.noteStart) {
      noteProgress = true
      continue
    }

    // 代码块处理
    codeBlock = lineInfo.codeBlock ? !codeBlock : codeBlock

    // 备注条件：备注标签中，非标题定义，或标题越位
    if (noteProgress || codeBlock || !lineInfo.level || lineInfo.level > level + 1) {
      if (node) _pushNote(node, line)
      continue
    }

    // 标题处理
    level = lineInfo.level
    node = _initNode(lineInfo.content, parentMap[level - 1])
    parentMap[level] = node
  }

  _cleanUp(parentMap[1])
  return parentMap[1]
}

function _initNode(text, parent) {
  const node = {
    data: {
      text: text,
      note: ''
    }
  }
  if (parent) {
    if (parent.children) parent.children.push(node)
    else parent.children = [node]
  }
  return node
}

function _pushNote(node, line) {
  node.data.note += line + '\n'
}

function _resolveLine(line) {
  const match = /^(#+)?\s*(.*)$/.exec(line)
  return {
    level: (match[1] && match[1].length) || null,
    content: match[2],
    noteStart: line === NOTE_MARK_START,
    noteClose: line === NOTE_MARK_CLOSE,
    codeBlock: /^\s*```/.test(line)
  }
}

function _cleanUp(node) {
  if (!/\S/.test(node.data.note)) {
    node.data.note = null
    delete node.data.note
  } else {
    const notes = node.data.note.split('\n')
    while (notes.length && !/\S/.test(notes[0])) notes.shift()
    while (notes.length && !/\S/.test(notes[notes.length - 1])) notes.pop()
    node.data.note = notes.join('\n')
  }
  if (node.children) node.children.forEach(_cleanUp)
}

data.registerProtocol(
  'markdown',
  (module.exports = {
    fileDescription: 'Markdown/GFM 格式',
    fileExtension: '.md',
    mineType: 'text/markdown',
    dataType: 'text',

    encode: function (json) {
      return encode(json.root)
    },

    decode: function (markdown) {
      return decode(markdown)
    }
  })
)
