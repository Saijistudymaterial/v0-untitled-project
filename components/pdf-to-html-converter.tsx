"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Code, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PdfToHtmlConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [convertedHtml, setConvertedHtml] = useState<string>("")
  const [preserveImages, setPreserveImages] = useState(true)
  const [preserveLinks, setPreserveLinks] = useState(true)
  const [preserveLayout, setPreserveLayout] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")
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
      setConvertedHtml("")
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
      setConvertedHtml("")
    }
  }

  const convertToHtml = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to convert.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Simulate HTML conversion
    setTimeout(() => {
      // This would be replaced with actual PDF to HTML conversion
      const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    p {
      margin-bottom: 16px;
    }
    .page {
      margin-bottom: 30px;
      page-break-after: always;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="page">
    <h1>Sample Document Title</h1>
    <p>This is a sample paragraph that would appear in the converted HTML document. The actual content would depend on the PDF file that was converted.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
    <img src="sample-image.jpg" alt="Sample Image">
    <p>Another paragraph with a <a href="https://example.com">sample link</a> that would be preserved if the option is selected.</p>
  </div>
</body>
</html>`

      setConvertedHtml(sampleHtml)
      setIsConverting(false)

      toast({
        title: "Conversion complete",
        description: "PDF has been converted to HTML.",
      })
    }, 2000)
  }

  const downloadHtml = () => {
    if (!convertedHtml) {
      toast({
        title: "No HTML to download",
        description: "Please convert a PDF file first.",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([convertedHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${file?.name.replace(".pdf", "")}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("pdf-upload-html")?.click()}
        >
          <input
            id="pdf-upload-html"
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
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setConvertedHtml("")
              }}
            >
              Change
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Conversion Options</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preserve-images">Preserve Images</Label>
                    <p className="text-xs text-gray-500">Include images from the PDF in the HTML</p>
                  </div>
                  <Switch id="preserve-images" checked={preserveImages} onCheckedChange={setPreserveImages} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preserve-links">Preserve Links</Label>
                    <p className="text-xs text-gray-500">Maintain hyperlinks from the PDF</p>
                  </div>
                  <Switch id="preserve-links" checked={preserveLinks} onCheckedChange={setPreserveLinks} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="preserve-layout">Preserve Layout</Label>
                    <p className="text-xs text-gray-500">Attempt to maintain the original PDF layout</p>
                  </div>
                  <Switch id="preserve-layout" checked={preserveLayout} onCheckedChange={setPreserveLayout} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Output Format</label>
                <Select defaultValue="responsive">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsive">Responsive HTML</SelectItem>
                    <SelectItem value="fixed">Fixed Layout</SelectItem>
                    <SelectItem value="simplified">Simplified Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={convertToHtml} disabled={isConverting}>
                {isConverting ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Converting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    Convert to HTML
                  </div>
                )}
              </Button>
            </div>

            {convertedHtml ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Converted HTML</h3>

                  <Button variant="outline" size="sm" onClick={downloadHtml}>
                    <Download className="h-4 w-4 mr-2" />
                    Download HTML
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Code className="h-4 w-4 mr-2" />
                      HTML Code
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <div className="border rounded-lg p-4 bg-white h-[300px] overflow-auto">
                      <iframe srcDoc={convertedHtml} title="HTML Preview" className="w-full h-full border-0" />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <div className="border rounded-lg p-4 bg-gray-50 h-[300px] overflow-auto">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap">{convertedHtml}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-center justify-center">
                <Code className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">Converted HTML will appear here</p>
                <p className="text-sm text-gray-400 mt-2 text-center">Configure options and click Convert</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">PDF to HTML Conversion Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Complex PDF layouts may not convert perfectly to HTML</li>
          <li>Preserving images will increase the file size of the HTML</li>
          <li>Responsive HTML works better on mobile devices</li>
          <li>Fixed layout preserves the original appearance but may not be mobile-friendly</li>
        </ul>
      </div>
    </div>
  )
}
