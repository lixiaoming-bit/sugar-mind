module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // If you are using less-loader@5 please spread the lessOptions to options directly
          modifyVars: {
            'primary-color': '#0fa731',
            'link-color': '#0fa731',
            'border-radius-base': '6px'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
