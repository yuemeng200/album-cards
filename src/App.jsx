import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { extractColors } from './utils/color'
import defaultImage from './assets/imgs/default.png'
import './App.less'

function App() {
  const [formData, setFormData] = useState({
    title: 'Bella Donna',
    description: '流行曲调、情感丰富的嗓音与沉稳的鼓点',
    imageUrl: defaultImage,
    titleFont: 'redoura',
    primaryColor: '#2563eb',
    number: '1',
    fontSize: 40,
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
          scale: 3, // 提高导出片质量
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

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragging')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragging')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragging')
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageUrl,
      }))
    }
  }

  useEffect(() => {
    const img = new Image()
    img.src = defaultImage
    img.crossOrigin = 'anonymous'
    img.onload = async () => {
      const colors = await extractColors(img)
      if (colors.length > 0) {
        setColorPalette(colors)
        setFormData(prev => ({
          ...prev,
          primaryColor: colors[0]
        }))
      }
    }
  }, [])

  return (
    <div className="container">
      {/* 左侧预览卡片 */}
      <div className="preview-card">
        <div className="card" ref={cardRef}>
          <div
            className={`card-title font-${formData.titleFont}`}
            style={{ 
              color: formData.primaryColor,
              fontSize: `${formData.fontSize}px`
            }}
            data-text={formData.title || '卡片标题'}
          >
            {formData.title || '卡片标题'}
          </div>
          <div className="card-detail">
            <div className="static">
              <div className="left">
                ·一万张摇滚专辑·
              </div>
              <div className="right" style={{ color: formData.primaryColor }}>
                No.{formData.number}
              </div>
            </div>
            <div className="description">
              {formData.description || '卡片描述'}
            </div>
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
        <div className="form-group">
          <label htmlFor="title">标题</label>
          <div className="title-control">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请输入标题"
            />
            <div className="font-controls">
              <select
                id="titleFont"
                name="titleFont"
                value={formData.titleFont}
                onChange={handleInputChange}
                className="font-select"
              >
                <option value="redoura">Redoura</option>
                <option value="chiller">Chiller</option>
                <option value="harngton">Harrington</option>
                <option value="mtcorsva">Monotype Corsiva</option>
              </select>
              <input
                type="number"
                id="fontSize"
                name="fontSize"
                value={formData.fontSize}
                onChange={handleInputChange}
                min="20"
                max="80"
                className="font-size-input"
              />
            </div>
          </div>
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
          <label htmlFor="imageUpload">上传图片</label>
          <div className="upload-area">
            <div 
              className="upload-trigger"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div className="upload-text">
                拖拽图片到这里，或 <span className="primary">点击上传</span>
                <br />
                <span>支持 JPG、PNG 格式</span>
              </div>
            </div>
            <input
              type="file"
              id="imageUpload"
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
            />
          </div>
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
        <div className="form-group">
          <label htmlFor="number">编号</label>
          <div className="number-input">
            <span className="prefix">No.</span>
            <input
              type="text"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              maxLength={3}
              placeholder="001"
            />
          </div>
        </div>
        <button className="export-btn" onClick={handleExport}>
          导出卡片
        </button>
      </div>
    </div>
  )
}

export default App
