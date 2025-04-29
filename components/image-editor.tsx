"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Upload, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, SunMedium, Palette, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ImageEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [editedImage, setEditedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("adjust")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { toast } = useToast()

  // Editing states
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

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
      resetEdits()

      // Generate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
          setEditedImage(e.target.result as string)

          // Create image element for canvas operations
          const img = new Image()
          img.src = e.target.result as string
          img.onload = () => {
            imageRef.current = img
            applyEdits()
          }
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
      resetEdits()

      // Generate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string)
          setEditedImage(e.target.result as string)

          // Create image element for canvas operations
          const img = new Image()
          img.src = e.target.result as string
          img.onload = () => {
            imageRef.current = img
            applyEdits()
          }
        }
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const resetEdits = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setFlipH(false)
    setFlipV(false)
  }

  const applyEdits = () => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    // Set canvas size based on rotation
    const useVertical = rotation === 90 || rotation === 270
    canvas.width = useVertical ? img.height : img.width
    canvas.height = useVertical ? img.width : img.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()

    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180)

    // Apply flips
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)

    // Reset transformation
    ctx.restore()

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`

    // Draw again with filters
    ctx.drawImage(canvas, 0, 0)

    // Update edited image
    setEditedImage(canvas.toDataURL("image/png"))
  }

  // Apply edits whenever any edit parameter changes
  useEffect(() => {
    if (preview) {
      applyEdits()
    }
  }, [brightness, contrast, saturation, rotation, flipH, flipV])

  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360)
  }

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const flipHorizontal = () => {
    setFlipH((prev) => !prev)
  }

  const flipVertical = () => {
    setFlipV((prev) => !prev)
  }

  const downloadEditedImage = () => {
    if (!editedImage) return

    const link = document.createElement("a")
    link.href = editedImage
    link.download = `edited_${file?.name || "image.png"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Image saved",
      description: "Your edited image has been downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload-editor")?.click()}
        >
          <input id="file-upload-editor" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your image here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button variant="outline">Select Image</Button>
          </div>
        </div>
      )}

      {file && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3">
              <div
                className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center items-center p-4"
                style={{ minHeight: "400px" }}
              >
                {editedImage && (
                  <img
                    src={editedImage || "/placeholder.svg"}
                    alt="Edited"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            </div>

            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white border rounded-lg p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="adjust">
                      <SunMedium className="h-4 w-4 mr-2" />
                      Adjust
                    </TabsTrigger>
                    <TabsTrigger value="transform">
                      <RotateCw className="h-4 w-4 mr-2" />
                      Transform
                    </TabsTrigger>
                    <TabsTrigger value="effects">
                      <Palette className="h-4 w-4 mr-2" />
                      Effects
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="adjust" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Brightness</label>
                        <span className="text-sm text-gray-500">{brightness}%</span>
                      </div>
                      <Slider
                        value={[brightness]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setBrightness(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Contrast</label>
                        <span className="text-sm text-gray-500">{contrast}%</span>
                      </div>
                      <Slider
                        value={[contrast]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setContrast(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Saturation</label>
                        <span className="text-sm text-gray-500">{saturation}%</span>
                      </div>
                      <Slider
                        value={[saturation]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={(value) => setSaturation(value[0])}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="transform" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" onClick={rotateLeft}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Rotate Left
                      </Button>

                      <Button variant="outline" onClick={rotateRight}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        Rotate Right
                      </Button>

                      <Button variant="outline" onClick={flipHorizontal}>
                        <FlipHorizontal className="mr-2 h-4 w-4" />
                        Flip Horizontal
                      </Button>

                      <Button variant="outline" onClick={flipVertical}>
                        <FlipVertical className="mr-2 h-4 w-4" />
                        Flip Vertical
                      </Button>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-gray-500">Current rotation: {rotation}°</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="effects" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setContrast(120)
                          setBrightness(110)
                          setSaturation(120)
                        }}
                      >
                        Enhance
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setContrast(100)
                          setBrightness(100)
                          setSaturation(0)
                        }}
                      >
                        Grayscale
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setContrast(150)
                          setBrightness(90)
                          setSaturation(120)
                        }}
                      >
                        Vivid
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setContrast(90)
                          setBrightness(110)
                          setSaturation(90)
                        }}
                      >
                        Soft
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex flex-col gap-4">
                <Button onClick={downloadEditedImage}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Edited Image
                </Button>

                <Button variant="outline" onClick={resetEdits}>
                  Reset All Edits
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                    setEditedImage(null)
                  }}
                >
                  Choose Another Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
