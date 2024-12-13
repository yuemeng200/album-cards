import ColorThief from 'colorthief'

// RGB转十六进制
export const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

// 从图片提取调色板
export const extractColors = async (imageElement) => {
  if (!imageElement) return []

  try {
    // 确保图片已完全加载
    await new Promise((resolve) => {
      if (imageElement.complete) {
        resolve()
      } else {
        imageElement.onload = resolve
      }
    })

    const colorThief = new ColorThief()
    const palette = colorThief.getPalette(imageElement, 8) // 获取8个主要颜色
    return palette.map(([r, g, b]) => rgbToHex(r, g, b))
  } catch (error) {
    console.error('提取颜色失败:', error)
    return []
  }
} 