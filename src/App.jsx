import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { extractColors } from './utils/color'
import './App.less'

function App() {
  const [formData, setFormData] = useState({
    title: 'Album Name',
    description: '',
    imageUrl: '',
    titleFont: 'redoura',
    primaryColor: '#1e293b',
  })
  const [colorPalette, setColorPalette] = useState([])
  const cardRef = useRef(null)
  const imageRef = useRef(null)

  const handleImageLoad = async () => {
    if (imageRef.current) {
      const colors = await extractColors(imageRef.current)
      if (colors.length > 0) {
        setColorPalette(colors)
        // 自动设置第一个颜色为主色
        setFormData(prev => ({
          ...prev,
          primaryColor: colors[0]
        }))
      }
    }
  }

  const handleColorClick = (color) => {
    setFormData(prev => ({
      ...prev,
      primaryColor: color
    }))
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageUrl,
      }))
    }
  }

  const handleExport = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, {
          backgroundColor: null,
          scale: 3, // 提高导出图片质量
          logging: false,
        })

        // 创建下载链接
        const link = document.createElement('a')
        link.download = `card-${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      } catch (error) {
        console.error('导出失败:', error)
      }
    }
  }

  return (
    <div className="container">
      {/* 左侧预览卡片 */}
      <div className="preview-card">
        <div className="card" ref={cardRef}>
          <h2 
            className={`card-title font-${formData.titleFont}`}
            style={{ color: formData.primaryColor }}
          >
            {formData.title || '卡片标题'}
          </h2>
          <div className="card-detail">
            <div className="static">
              <div className="left">
                ·一万张摇滚专辑·
              </div>
              <div className="right" style={{ color: formData.primaryColor }}>
                No.
              </div>
            </div>
            <p className="description">
              {formData.description || '卡片描述'}
            </p>
          </div>
          <div className="card-image-container">
            {formData.imageUrl && (
              <img
                ref={imageRef}
                src={formData.imageUrl}
                alt="Preview"
                className="card-image"
                onLoad={handleImageLoad}
                crossOrigin="anonymous" // 添加这个属性以处理跨域图片
              />
            )}
          </div>
        </div>
      </div>

      {/* 右侧表单编辑器 */}
      <div className="form-editor">
        <h2>编辑卡片</h2>
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="请输入标题"
          />
        </div>
        <div className="form-group">
          <label htmlFor="titleFont">标题字体</label>
          <select
            id="titleFont"
            name="titleFont"
            value={formData.titleFont}
            onChange={handleInputChange}
            className="font-select">
            <option value="redoura">Redoura</option>
            <option value="chiller">Chiller</option>
            <option value="fzytk">方正姚体</option>
            <option value="harngton">Harrington</option>
            <option value="mtcorsva">Monotype Corsiva</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="请输入描述"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">图片URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="请输入图片URL"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUpload">或上传图片</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div className="form-group">
          <label htmlFor="primaryColor">主色调</label>
          <div className="color-picker">
            <input
              type="color"
              id="primaryColor"
              name="primaryColor"
              value={formData.primaryColor}
              onChange={handleInputChange}
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={handleInputChange}
              name="primaryColor"
              placeholder="#000000"
            />
          </div>
          {colorPalette.length > 0 && (
            <div className="color-palette">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  className="color-item"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
        <button className="export-btn" onClick={handleExport}>
          导出卡片
        </button>
      </div>
    </div>
  )
}

export default App
