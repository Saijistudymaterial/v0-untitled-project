"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Link, Mail, Phone, Wifi, MapPin, QrCode, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function QrCodeGenerator() {
  const [qrContent, setQrContent] = useState("")
  const [qrType, setQrType] = useState("url")
  const [qrColor, setQrColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [size, setSize] = useState(200)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Form fields for different QR types
  const [url, setUrl] = useState("https://")
  const [email, setEmail] = useState({ address: "", subject: "", body: "" })
  const [phone, setPhone] = useState("")
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" })
  const [location, setLocation] = useState({ latitude: "", longitude: "" })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file for the logo.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogo(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const generateQRContent = () => {
    switch (qrType) {
      case "url":
        return url
      case "email":
        return `mailto:${email.address}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`
      case "phone":
        return `tel:${phone}`
      case "wifi":
        return `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`
      case "location":
        return `geo:${location.latitude},${location.longitude}`
      default:
        return qrContent
    }
  }

  const generateQRCode = () => {
    const content = generateQRContent()

    if (!content) {
      toast({
        title: "Empty content",
        description: "Please enter content for the QR code.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would use a QR code generation library
    // For this demo, we'll simulate the QR code with a placeholder

    // Simulate QR code generation
    setTimeout(() => {
      // This would be replaced with actual QR code generation
      const qrDataUrl = `/placeholder.svg?height=${size}&width=${size}`
      setQrImage(qrDataUrl)

      toast({
        title: "QR Code generated",
        description: "Your QR code has been created successfully.",
      })
    }, 500)
  }

  const downloadQRCode = () => {
    if (!qrImage) {
      toast({
        title: "No QR code",
        description: "Please generate a QR code first.",
        variant: "destructive",
      })
      return
    }

    // In a real implementation, we would create a proper download
    // For this demo, we'll simulate the download

    const link = document.createElement("a")
    link.href = qrImage
    link.download = "qrcode.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="url" onValueChange={(value) => setQrType(value)}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="wifi">
                <Wifi className="h-4 w-4 mr-2" />
                WiFi
              </TabsTrigger>
              <TabsTrigger value="location">
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">Website URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="example@example.com"
                  value={email.address}
                  onChange={(e) => setEmail({ ...email, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  type="text"
                  placeholder="Email subject"
                  value={email.subject}
                  onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-body">Body</Label>
                <textarea
                  id="email-body"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Email body"
                  value={email.body}
                  onChange={(e) => setEmail({ ...email, body: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="wifi-ssid">Network Name (SSID)</Label>
                <Input
                  id="wifi-ssid"
                  type="text"
                  placeholder="WiFi Network Name"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifi-password">Password</Label>
                <Input
                  id="wifi-password"
                  type="text"
                  placeholder="WiFi Password"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifi-encryption">Encryption</Label>
                <Select value={wifi.encryption} onValueChange={(value) => setWifi({ ...wifi, encryption: value })}>
                  <SelectTrigger id="wifi-encryption">
                    <SelectValue placeholder="Select encryption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="text"
                  placeholder="e.g. 37.7749"
                  value={location.latitude}
                  onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="text"
                  placeholder="e.g. -122.4194"
                  value={location.longitude}
                  onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium">QR Code Customization</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qr-color">QR Code Color</Label>
                <div className="flex">
                  <Input
                    id="qr-color"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 p-1 h-10"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="qr-size">Size: {size}px</Label>
              </div>
              <Slider
                id="qr-size"
                value={[size]}
                min={100}
                max={500}
                step={10}
                onValueChange={(value) => setSize(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-upload">Add Logo (Optional)</Label>
              <div className="flex items-center">
                <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                  className="flex-1"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {logo ? "Change Logo" : "Upload Logo"}
                </Button>
                {logo && (
                  <Button variant="outline" onClick={() => setLogo(null)} className="ml-2">
                    Remove
                  </Button>
                )}
              </div>
              {logo && (
                <div className="mt-2">
                  <img
                    src={logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-16 object-contain mx-auto border rounded p-1"
                  />
                </div>
              )}
            </div>

            <Button onClick={generateQRCode} className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border rounded-lg p-6 bg-gray-50">
          {qrImage ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-md inline-block mb-4">
                <img
                  src={qrImage || "/placeholder.svg"}
                  alt="Generated QR Code"
                  style={{ width: `${size}px`, height: `${size}px` }}
                  className="mx-auto"
                />
              </div>

              <Button onClick={downloadQRCode}>
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <QrCode className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your QR code will appear here</p>
              <p className="text-sm text-gray-400 mt-2">Fill in the details and click Generate</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">QR Code Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Use high contrast colors for better scanning</li>
          <li>Avoid very small QR codes as they may be difficult to scan</li>
          <li>Test your QR code with different devices before sharing</li>
          <li>Adding a logo may reduce scanability with some readers</li>
        </ul>
      </div>
    </div>
  )
}
