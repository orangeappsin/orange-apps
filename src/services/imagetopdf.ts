import { jsPDF } from 'jspdf'


export const acceptedTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/tif',
])


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


function getPdfImageFormat(file: File): string {
  const type = file.type.toLowerCase()


  if (type === 'image/png') return 'PNG'
  if (type === 'image/webp') return 'WEBP'
  if (type === 'image/jpeg' || type === 'image/jpg') return 'JPEG'
  if (type === 'image/gif') return 'GIF'
  if (type === 'image/tiff' || type === 'image/tif') return 'TIFF'


  return 'PNG'
}


export async function createPdf(files: File[]): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Please select at least one image.')
  }


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
    const format = getPdfImageFormat(file)


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




