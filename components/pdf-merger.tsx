"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileText, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PdfMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [mergedUrl, setMergedUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.filter((file) => file.type === "application/pdf")

      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: "Invalid files detected",
          description: "Only PDF files are allowed.",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...validFiles])
    }
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
      const validFiles = droppedFiles.filter((file) => file.type === "application/pdf")

      if (validFiles.length !== droppedFiles.length) {
        toast({
          title: "Invalid files detected",
          description: "Only PDF files are allowed.",
          variant: "destructive",
        })
      }

      setFiles((prev) => [...prev, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const moveFileUp = (index: number) => {
    if (index === 0) return
    const newFiles = [...files]
    ;[newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]]
    setFiles(newFiles)
  }

  const moveFileDown = (index: number) => {
    if (index === files.length - 1) return
    const newFiles = [...files]
    ;[newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]]
    setFiles(newFiles)
  }

  const mergePdfs = () => {
    if (files.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please select at least two PDF files to merge.",
        variant: "destructive",
      })
      return
    }

    setIsMerging(true)

    // Simulate PDF merging
    setTimeout(() => {
      // In a real implementation, we would merge the PDFs here
      // and provide a download link
      setMergedUrl("#")
      setIsMerging(false)

      toast({
        title: "PDFs merged successfully",
        description: `${files.length} PDFs have been merged into one document.`,
      })
    }, 2000)
  }

  const downloadMergedPdf = () => {
    if (!mergedUrl) {
      toast({
        title: "No merged PDF",
        description: "Please merge PDF files first.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would provide a download link to the merged PDF
    // For this demo, we'll just show a toast
    toast({
      title: "Download started",
      description: "Your merged PDF is being downloaded.",
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

  return (
    <div className="space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("pdf-upload-merger")?.click()}
      >
        <input
          id="pdf-upload-merger"
          type="file"
          multiple
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center">
          <Plus className="h-10 w-10 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">Add PDF Files</h3>
          <p className="text-sm text-gray-500 mb-4">Drag and drop PDFs here or click to browse</p>
          <Button variant="outline">Select PDFs</Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">PDF Files to Merge ({files.length})</h3>
            <p className="text-sm text-gray-500">Drag to reorder</p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 text-sm font-medium border-b">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-1">#</div>
                <div className="col-span-7">Filename</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            <div className="divide-y">
              {files.map((file, index) => (
                <div key={index} className="p-3 bg-white hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 font-medium">{index + 1}</div>
                    <div className="col-span-7 truncate">{file.name}</div>
                    <div className="col-span-2 text-sm text-gray-500">{formatBytes(file.size)}</div>
                    <div className="col-span-2 flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveFileUp(index)}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveFileDown(index)}
                        disabled={index === files.length - 1}
                        className="h-8 w-8"
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={mergePdfs} disabled={isMerging || files.length < 2} className="w-full md:w-auto">
              {isMerging ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Merging PDFs...
                </div>
              ) : (
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Merge PDFs
                </div>
              )}
            </Button>
          </div>

          {mergedUrl && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={downloadMergedPdf} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Merged PDF
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">PDF Merger Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Drag and drop multiple PDFs to add them all at once</li>
          <li>Reorder files using the up and down arrows</li>
          <li>Files will be merged in the order shown in the list</li>
          <li>For best results, use PDFs with the same page size</li>
        </ul>
      </div>
    </div>
  )
}
