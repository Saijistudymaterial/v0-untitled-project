"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState("jpeg")
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setCompressedPreview(null)
      setCompressedSize(null)

      // Generate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]

      if (!droppedFile.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)
      setOriginalSize(droppedFile.size)
      setCompressedPreview(null)
      setCompressedSize(null)

      // Generate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const compressImage = () => {
    if (!file || !preview) {
      toast({
        title: "No image selected",
        description: "Please select an image to compress.",
        variant: "destructive",
      })
      return
    }

    setIsCompressing(true)

    // Create a canvas element to compress the image
    const img = new Image()
    img.src = preview

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Draw image on canvas
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Convert canvas to compressed data URL
      const compressedDataUrl = canvas.toDataURL(`image/${format}`, quality / 100)
      setCompressedPreview(compressedDataUrl)

      // Calculate compressed size
      const base64str = compressedDataUrl.split(",")[1]
      const compressedBytes = atob(base64str).length
      setCompressedSize(compressedBytes)

      setIsCompressing(false)

      toast({
        title: "Image compressed successfully",
        description: `Reduced from ${formatBytes(originalSize!)} to ${formatBytes(compressedBytes)}`,
      })
    }
  }

  const downloadCompressedImage = () => {
    if (!compressedPreview) return

    const link = document.createElement("a")
    link.href = compressedPreview
    link.download = `compressed_${file?.name.split(".")[0]}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetCompression = () => {
    setCompressedPreview(null)
    setCompressedSize(null)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  const calculateSavings = () => {
    if (originalSize && compressedSize) {
      const savingsPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      return `${savingsPercent}%`
    }
    return null
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload-compressor")?.click()}
        >
          <input
            id="file-upload-compressor"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your image here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button variant="outline">Select Image</Button>
          </div>
        </div>
      )}

      {file && !compressedPreview && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 text-sm font-medium">Original Image</div>
                <div className="p-4 flex justify-center">
                  <img src={preview! || "/placeholder.svg"} alt="Original" className="max-h-64 object-contain" />
                </div>
                <div className="bg-gray-50 p-2 text-sm text-gray-600">Size: {formatBytes(originalSize!)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Compression Settings</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Quality: {quality}%</label>
                  <span className="text-sm text-gray-500">
                    {quality < 50 ? "High Compression" : quality < 80 ? "Medium" : "Low Compression"}
                  </span>
                </div>
                <Slider value={[quality]} min={10} max={100} step={1} onValueChange={(value) => setQuality(value[0])} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              <h3 className="font-medium">Compression Preview</h3>
              <p className="text-sm text-gray-500 flex-grow">
                Adjust the quality slider to control the compression level. Lower quality means smaller file size but
                may reduce image clarity.
              </p>
              <Button className="w-full mt-auto" onClick={compressImage} disabled={isCompressing}>
                {isCompressing ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Compressing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Compress Image
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {compressedPreview && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 text-sm font-medium">Original Image</div>
                <div className="p-4 flex justify-center">
                  <img src={preview! || "/placeholder.svg"} alt="Original" className="max-h-64 object-contain" />
                </div>
                <div className="bg-gray-50 p-2 text-sm text-gray-600">Size: {formatBytes(originalSize!)}</div>
              </div>
            </div>

            <div className="flex-1">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 p-2 text-sm font-medium">Compressed Image</div>
                <div className="p-4 flex justify-center">
                  <img
                    src={compressedPreview || "/placeholder.svg"}
                    alt="Compressed"
                    className="max-h-64 object-contain"
                  />
                </div>
                <div className="bg-gray-50 p-2 text-sm text-gray-600 flex justify-between">
                  <span>Size: {formatBytes(compressedSize!)}</span>
                  <span className="text-green-600 font-medium">Saved: {calculateSavings()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={downloadCompressedImage}>
              <Download className="mr-2 h-4 w-4" />
              Download Compressed Image
            </Button>

            <Button variant="outline" onClick={resetCompression}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Different Settings
            </Button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Tips for optimal compression</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>JPEG is best for photographs and complex images</li>
          <li>PNG is better for images with transparency</li>
          <li>WebP offers the best compression but may not be supported by all browsers</li>
          <li>Lower quality settings work well for social media and web use</li>
          <li>Higher quality is recommended for printing</li>
        </ul>
      </div>
    </div>
  )
}
