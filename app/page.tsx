import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageToPdfConverter } from "@/components/image-to-pdf-converter"
import { ImageCompressor } from "@/components/image-compressor"
import { ImageEditor } from "@/components/image-editor"
import { VideoEditor } from "@/components/video-editor"
import { QrCodeGenerator } from "@/components/qr-code-generator"
import { PdfToTextConverter } from "@/components/pdf-to-text-converter"
import { PdfToHtmlConverter } from "@/components/pdf-to-html-converter"
import { PdfCompressor } from "@/components/pdf-compressor"
import { PdfMerger } from "@/components/pdf-merger"
import { HeroSection } from "@/components/hero-section"
import { AdBanner } from "@/components/ad-banner"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <AdBanner position="top" />

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">All-in-One Conversion Tools</h2>

          <Tabs defaultValue="image-to-pdf" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 mb-6">
              <TabsTrigger value="image-to-pdf">Image to PDF</TabsTrigger>
              <TabsTrigger value="image-compressor">Image Compressor</TabsTrigger>
              <TabsTrigger value="image-editor">Image Editor</TabsTrigger>
              <TabsTrigger value="video-editor">Video Editor</TabsTrigger>
              <TabsTrigger value="qr-generator">QR Generator</TabsTrigger>
              <TabsTrigger value="pdf-to-text">PDF to Text</TabsTrigger>
              <TabsTrigger value="pdf-to-html">PDF to HTML</TabsTrigger>
              <TabsTrigger value="pdf-compressor">PDF Compressor</TabsTrigger>
              <TabsTrigger value="pdf-merger">PDF Merger</TabsTrigger>
            </TabsList>

            <TabsContent value="image-to-pdf" className="mt-4">
              <ImageToPdfConverter />
            </TabsContent>

            <TabsContent value="image-compressor" className="mt-4">
              <ImageCompressor />
            </TabsContent>

            <TabsContent value="image-editor" className="mt-4">
              <ImageEditor />
            </TabsContent>

            <TabsContent value="video-editor" className="mt-4">
              <VideoEditor />
            </TabsContent>

            <TabsContent value="qr-generator" className="mt-4">
              <QrCodeGenerator />
            </TabsContent>

            <TabsContent value="pdf-to-text" className="mt-4">
              <PdfToTextConverter />
            </TabsContent>

            <TabsContent value="pdf-to-html" className="mt-4">
              <PdfToHtmlConverter />
            </TabsContent>

            <TabsContent value="pdf-compressor" className="mt-4">
              <PdfCompressor />
            </TabsContent>

            <TabsContent value="pdf-merger" className="mt-4">
              <PdfMerger />
            </TabsContent>
          </Tabs>
        </div>

        <AdBanner position="middle" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-3">Fast Conversion</h3>
            <p>Convert your files in seconds with our optimized algorithms.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-3">Privacy First</h3>
            <p>All processing happens in your browser. Your files never leave your device.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-3">Multiple Formats</h3>
            <p>Support for various file formats to meet all your conversion needs.</p>
          </div>
        </div>

        <AdBanner position="bottom" />
      </div>

      <Footer />
    </main>
  )
}
