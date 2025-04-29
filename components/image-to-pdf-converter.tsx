"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageToPdfConverter() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [quality, setQuality] = useState(80)
  const [pageSize, setPageSize] = useState("a4")
  const [orientation, setOrientation] = useState("portrait")
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))

      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: "Invalid files detected",
          description: "Only image files are allowed.",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...validFiles])

      // Generate previews
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const validFiles = droppedFiles.filter((file) => file.type.startsWith("image/"))

      if (validFiles.length !== droppedFiles.length) {
        toast({
          title: "Invalid files detected",
          description: "Only image files are allowed.",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...validFiles])

      // Generate previews
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const convertToPdf = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to convert.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Simulate conversion process
    setTimeout(() => {
      toast({
        title: "Conversion complete!",
        description: `${files.length} image${files.length > 1 ? "s" : ""} converted to PDF.`,
      })
      setIsConverting(false)

      // In a real implementation, we would generate the PDF here
      // and provide a download link
      const link = document.createElement("a")
      link.href = "#" // This would be the PDF URL
      link.download = "converted.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your images here</h3>
          <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
          <Button variant="outline">Select Images</Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">PDF Settings</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Page Size</label>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Orientation</label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Image Quality</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Quality: {quality}%</label>
                  <span className="text-sm text-gray-500">
                    {quality < 50 ? "Low" : quality < 80 ? "Medium" : "High"}
                  </span>
                </div>
                <Slider value={[quality]} min={10} max={100} step={1} onValueChange={(value) => setQuality(value[0])} />
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={convertToPdf} disabled={isConverting || files.length === 0}>
                  {isConverting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Converting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Convert to PDF
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Tips for best results</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Use high-resolution images for better quality</li>
          <li>For multi-page PDFs, upload images in the correct order</li>
          <li>Adjust quality settings based on your needs</li>
          <li>Choose the appropriate page size and orientation</li>
        </ul>
      </div>
    </div>
  )
}
