export const checkOs = () => {
  const { userAgent } = window.navigator
  if (userAgent.includes('Mac')) {
    return 'mac'
  }
  if (userAgent.includes('Window')) {
    return 'windows'
  }
  return 'null'
}
