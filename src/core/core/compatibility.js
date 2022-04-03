function compatibility(json) {
  // const version = json.version || (json.root ? '1.0.0' : '1.0.0')

  // switch (version) {
  //   case '1.0.0':
  //     break
  // }
  return json
}

// 遍历
// function traverse(node, fn) {
//   fn(node)
//   if (node.children)
//     node.children.forEach(function (child) {
//       traverse(child, fn)
//     })
// }

export default compatibility
