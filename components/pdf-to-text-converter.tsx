"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Copy, FileText, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PdfToTextConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)
  const [language, setLanguage] = useState("en")
  const [copied, setCopied] = useState(false)
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
      setExtractedText("")
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
      setExtractedText("")
    }
  }

  const convertToText = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Simulate text extraction
    setTimeout(() => {
      // This would be replaced with actual PDF text extraction
      const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

      setExtractedText(sampleText)
      setIsConverting(false)

      toast({
        title: "Conversion complete",
        description: "Text has been extracted from the PDF.",
      })
    }, 2000)
  }

  const downloadText = () => {
    if (!extractedText) {
      toast({
        title: "No text to download",
        description: "Please convert a PDF file first.",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([extractedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file?.name.replace(".pdf", "")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyToClipboard = () => {
    if (!extractedText) {
      toast({
        title: "No text to copy",
        description: "Please convert a PDF file first.",
        variant: "destructive",
      })
      return
    }

    navigator.clipboard.writeText(extractedText).then(() => {
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The extracted text has been copied to your clipboard.",
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("pdf-upload")?.click()}
        >
          <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />

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
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setExtractedText("")
              }}
            >
              Change
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Conversion Options</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Select the primary language of the PDF for better text extraction
                </p>
              </div>

              <Button className="w-full" onClick={convertToText} disabled={isConverting}>
                {isConverting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Converting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Convert to Text
                  </div>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Extracted Text</h3>

                {extractedText && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>

                    <Button variant="outline" size="sm" onClick={downloadText}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 h-[200px] overflow-auto">
                {extractedText ? (
                  <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>Extracted text will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">PDF to Text Conversion Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Scanned PDFs may require OCR for accurate text extraction</li>
          <li>Text formatting and layout may not be preserved in the extracted text</li>
          <li>Select the correct language for better extraction results</li>
          <li>Some PDFs with complex layouts may not convert perfectly</li>
        </ul>
      </div>
    </div>
  )
}
