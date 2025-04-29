"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Download, FileText, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionLevel, setCompressionLevel] = useState(70)
  const [removeImages, setRemoveImages] = useState(false)
  const [removeAnnotations, setRemoveAnnotations] = useState(false)
  const [removeMetadata, setRemoveMetadata] = useState(true)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      setOriginalSize(selectedFile.size)
      setCompressedSize(null)
      setCompressedUrl(null)
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

      if (droppedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file.",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)
      setOriginalSize(droppedFile.size)
      setCompressedSize(null)
      setCompressedUrl(null)
    }
  }

  const compressPdf = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to compress.",
        variant: "destructive",
      })
      return
    }

    setIsCompressing(true)

    // Simulate PDF compression
    setTimeout(() => {
      // Calculate a simulated compressed size based on settings
      let compressionRatio = compressionLevel / 100

      // Adjust ratio based on other settings
      if (removeImages) compressionRatio *= 0.5
      if (removeAnnotations) compressionRatio *= 0.9
      if (removeMetadata) compressionRatio *= 0.95

      // Ensure we don't compress too much (minimum 10% of original)
      compressionRatio = Math.max(0.1, compressionRatio)

      const simulatedCompressedSize = Math.floor(originalSize! * compressionRatio)
      setCompressedSize(simulatedCompressedSize)

      // In a real implementation, we would generate a compressed PDF
      // For this demo, we'll just simulate having a URL
      setCompressedUrl("#")

      setIsCompressing(false)

      toast({
        title: "PDF compressed successfully",
        description: `Reduced from ${formatBytes(originalSize!)} to ${formatBytes(simulatedCompressedSize)}`,
      })
    }, 2000)
  }

  const downloadCompressedPdf = () => {
    if (!compressedUrl) {
      toast({
        title: "No compressed PDF",
        description: "Please compress a PDF file first.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would provide a download link to the compressed PDF
    // For this demo, we'll just show a toast
    toast({
      title: "Download started",
      description: "Your compressed PDF is being downloaded.",
    })
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

  const getCompressionLevelLabel = () => {
    if (compressionLevel < 30) return "Maximum (Lower Quality)"
    if (compressionLevel < 60) return "High"
    if (compressionLevel < 80) return "Medium"
    return "Low (Higher Quality)"
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("pdf-upload-compressor")?.click()}
        >
          <input
            id="pdf-upload-compressor"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your PDF here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button variant="outline">Select PDF</Button>
          </div>
        </div>
      )}

      {file && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">{formatBytes(originalSize!)}</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setOriginalSize(null)
                setCompressedSize(null)
                setCompressedUrl(null)
              }}
            >
              Change
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Compression Settings</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Compression Level: {compressionLevel}%</label>
                    <span className="text-sm text-gray-500">{getCompressionLevelLabel()}</span>
                  </div>
                  <Slider
                    value={[compressionLevel]}
                    min={10}
                    max={100}
                    step={1}
                    onValueChange={(value) => setCompressionLevel(value[0])}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Advanced Options</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remove-images">Remove Images</Label>
                      <p className="text-xs text-gray-500">Remove all images from the PDF</p>
                    </div>
                    <Switch id="remove-images" checked={removeImages} onCheckedChange={setRemoveImages} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remove-annotations">Remove Annotations</Label>
                      <p className="text-xs text-gray-500">Remove comments and form fields</p>
                    </div>
                    <Switch
                      id="remove-annotations"
                      checked={removeAnnotations}
                      onCheckedChange={setRemoveAnnotations}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remove-metadata">Remove Metadata</Label>
                      <p className="text-xs text-gray-500">Remove document information and metadata</p>
                    </div>
                    <Switch id="remove-metadata" checked={removeMetadata} onCheckedChange={setRemoveMetadata} />
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={compressPdf} disabled={isCompressing}>
                {isCompressing ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Compressing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Compress PDF
                  </div>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Compression Results</h3>

              {compressedSize ? (
                <div className="space-y-6">
                  <div className="bg-white p-6 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Original Size</p>
                        <p className="text-lg font-medium">{formatBytes(originalSize!)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Compressed Size</p>
                        <p className="text-lg font-medium">{formatBytes(compressedSize)}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${100 - (compressedSize / originalSize!) * 100}%` }}
                      ></div>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="text-green-600 font-medium text-lg">
                        Saved {calculateSavings()} ({formatBytes(originalSize! - compressedSize)})
                      </p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={downloadCompressedPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Compressed PDF
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center h-[250px]">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">Compression results will appear here</p>
                  <p className="text-sm text-gray-400 mt-2 text-center">Adjust settings and click Compress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">PDF Compression Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Higher compression levels may reduce image quality</li>
          <li>Removing images will significantly reduce file size but may affect content</li>
          <li>Removing metadata is safe for most documents and reduces size</li>
          <li>For text-heavy documents, compression may have less impact</li>
        </ul>
      </div>
    </div>
  )
}
