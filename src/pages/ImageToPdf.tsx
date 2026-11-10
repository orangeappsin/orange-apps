import { useEffect, useMemo, useRef, useState } from 'react'
import { jsPDF } from 'jspdf'
import './ImageToPdf.css'

const acceptedTypes = new Set(['image/jpeg', 'image/png'])

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error(`Unable to read ${file.name}.`))
    }
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`))
    reader.readAsDataURL(file)
  })
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('One of the selected files is not a valid image.'))
    image.src = source
  })
}

async function createPdf(files: File[]): Promise<Blob> {
  const firstSource = await readImage(files[0])
  const firstImage = await loadImage(firstSource)
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const margin = 10

  for (const [index, file] of files.entries()) {
    const source = index === 0 ? firstSource : await readImage(file)
    const image = index === 0 ? firstImage : await loadImage(source)

    if (index > 0) pdf.addPage('a4', 'portrait')

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const scale = Math.min(
      (pageWidth - margin * 2) / image.width,
      (pageHeight - margin * 2) / image.height,
    )
    const width = image.width * scale
    const height = image.height * scale
    const format = file.type === 'image/png' ? 'PNG' : 'JPEG'

    pdf.addImage(
      source,
      format,
      (pageWidth - width) / 2,
      (pageHeight - height) / 2,
      width,
      height,
    )
  }

  return pdf.output('blob')
}

function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  )
  const previewPages = useMemo(() => {
    const pageSize = 6
    return Array.from({ length: Math.ceil(previews.length / pageSize) }, (_, pageIndex) =>
      previews.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize))
  }, [previews])

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews])

  const addFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) => acceptedTypes.has(file.type))
    setFiles((current) => [...current, ...validFiles])
    setError(validFiles.length < selectedFiles.length
      ? 'Only JPG and PNG images are supported.'
      : '')
  }

  const moveFile = (fromIndex: number, toIndex: number) => {
    setFiles((current) => {
      if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) {
        return current
      }

      const reordered = [...current]
      const [movedFile] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, movedFile)
      return reordered
    })
  }

  const convert = async () => {
    if (files.length === 0 || isConverting) return

    setIsConverting(true)
    setError('')
    try {
      const pdf = await createPdf(files)
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = 'images.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (conversionError) {
      setError(conversionError instanceof Error
        ? conversionError.message
        : 'PDF conversion failed. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <section className="image-to-pdf-page">
      <div className="converter-shell">
        <div className="converter-workspace">
          <div className="converter-left-panel">
            <div className="converter-heading">
              <div className="converter-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M8 3h11l7 7v19H8z" /><path d="M19 3v8h7M12 18h10M12 22h10M12 26h6" /></svg>
              </div>
              <div className="converter-title">
                <p className="apps-kicker">Free online tool</p>
                <h1>Image to PDF</h1>
              </div>
              <p className="converter-subtitle">Convert JPG and PNG images into A4 pages.</p>
            </div>

            <div
              className="converter-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                addFiles(Array.from(event.dataTransfer.files))
              }}
            >
              <div className="upload-symbol" aria-hidden="true">↑</div>
              <h2>Drop your images here</h2>
              <p>or choose images from your device</p>
              <button className="choose-images-button" onClick={() => fileInput.current?.click()}>
                Choose images
              </button>
              <input
                ref={fileInput}
                className="converter-file-input"
                type="file"
                accept="image/jpeg,image/png"
                multiple
                aria-label="Choose JPG or PNG images"
                onChange={(event) => {
                  addFiles(Array.from(event.target.files ?? []))
                  event.target.value = ''
                }}
              />
              <span className="upload-hint">JPG or PNG · Files stay on your device</span>
            </div>
          </div>

          <div className="selected-images">
            <div className="selected-images-heading">
              <h2>Your images</h2>
              <span>
                {files.length} {files.length === 1 ? 'image' : 'images'}
                {files.length > 1 && ' · drag to reorder'}
                {previewPages.length > 1 && ' · scroll for more'}
              </span>
            </div>
            {previews.length > 0 ? (
              <div className="image-preview-list">
                {previewPages.map((page, pageIndex) => {
                  const rows = page.length > 3 ? 2 : 1
                  return (
                    <div
                      className="image-preview-page"
                      key={pageIndex}
                      style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
                    >
                      {page.map(({ file, url }, pageItemIndex) => {
                        const index = pageIndex * 6 + pageItemIndex
                        const span = page.length <= 3
                          ? 6 / page.length
                          : page.length === 4
                            ? 3
                            : page.length === 5 && pageItemIndex >= 3
                              ? 3
                              : 2

                        return (
                          <article
                            className={`image-preview${draggedIndex === index ? ' is-dragging' : ''}`}
                            key={`${file.name}-${index}`}
                            style={{ gridColumn: `span ${span}` }}
                            draggable
                            onDragStart={(event) => {
                              event.dataTransfer.effectAllowed = 'move'
                              event.dataTransfer.setData('text/plain', String(index))
                              setDraggedIndex(index)
                            }}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              const sourceIndex = event.dataTransfer.getData('text/plain')
                              const fromIndex = Number(sourceIndex)
                              if (sourceIndex !== '' && Number.isInteger(fromIndex)) moveFile(fromIndex, index)
                              setDraggedIndex(null)
                            }}
                            onDragEnd={() => setDraggedIndex(null)}
                            title="Drag to reorder"
                          >
                            <img src={url} alt={`Preview of ${file.name}`} />
                            <div className="image-preview-copy">
                              <span title={file.name}>{file.name}</span>
                              <small>{(file.size / 1024).toFixed(0)} KB</small>
                            </div>
                            <div className="image-order-actions">
                              <button
                                aria-label={`Move ${file.name} earlier`}
                                disabled={index === 0}
                                onClick={() => moveFile(index, index - 1)}
                              >
                                ←
                              </button>
                              <button
                                aria-label={`Move ${file.name} later`}
                                disabled={index === files.length - 1}
                                onClick={() => moveFile(index, index + 1)}
                              >
                                →
                              </button>
                              <button
                                className="remove-image-button"
                                aria-label={`Remove ${file.name}`}
                                onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                              >
                                ×
                              </button>
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="empty-image-list">Your selected images will appear here.</div>
            )}
            <button
              className="convert-button"
              disabled={files.length === 0 || isConverting}
              onClick={convert}
            >
              {isConverting ? 'Creating your PDF…' : 'Convert & download PDF'}
              {!isConverting && <span aria-hidden="true">→</span>}
            </button>
          </div>

        </div>
        {error && <p className="converter-error" role="alert">{error}</p>}
      </div>
    </section>
  )
}

export default ImageToPdf
