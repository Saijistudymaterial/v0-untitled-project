"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Scissors, Volume2, Play, Pause, RotateCw, Save, Film } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function VideoEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      if (!selectedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file.",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setVideoUrl(url)
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

      if (!droppedFile.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file.",
          variant: "destructive",
        })
        return
      }

      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setVideoUrl(url)
    }
  }

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      setDuration(videoDuration)
      setEndTime(videoDuration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleTrimChange = (value: number[]) => {
    setStartTime(value[0])
    setEndTime(value[1])
  }

  const trimVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime
      setIsPlaying(true)
      videoRef.current.play()

      // In a real implementation, we would use a video editing library
      // to actually trim the video. This is just a simulation.
      toast({
        title: "Trim points set",
        description: `Video will be trimmed from ${formatTime(startTime)} to ${formatTime(endTime)}`,
      })
    }
  }

  const downloadVideo = () => {
    toast({
      title: "Feature in development",
      description: "Video download functionality will be available soon.",
    })
  }

  return (
    <div className="space-y-6">
      {!file && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("video-upload")?.click()}
        >
          <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />

          <div className="flex flex-col items-center justify-center">
            <Film className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your video here</h3>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <Button variant="outline">Select Video</Button>
          </div>
        </div>
      )}

      {file && videoUrl && (
        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full max-h-[400px]"
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            ></video>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>

            <Tabs defaultValue="trim">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="trim">
                  <Scissors className="h-4 w-4 mr-2" />
                  Trim
                </TabsTrigger>
                <TabsTrigger value="effects">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="export">
                  <Save className="h-4 w-4 mr-2" />
                  Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trim" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{formatTime(startTime)}</span>
                    <span className="text-sm">{formatTime(endTime)}</span>
                  </div>
                  <Slider
                    value={[startTime, endTime]}
                    min={0}
                    max={duration}
                    step={0.1}
                    onValueChange={handleTrimChange}
                  />
                </div>

                <Button onClick={trimVideo}>
                  <Scissors className="mr-2 h-4 w-4" />
                  Set Trim Points
                </Button>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Normal Speed</Button>

                  <Button variant="outline">Slow Motion (0.5x)</Button>

                  <Button variant="outline">Fast Forward (1.5x)</Button>

                  <Button variant="outline">Reverse</Button>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500">
                    Note: Effects are applied in real-time preview only. Final rendering will be done during export.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select defaultValue="mp4">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (480p)</SelectItem>
                      <SelectItem value="medium">Medium (720p)</SelectItem>
                      <SelectItem value="high">High (1080p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={downloadVideo}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Video
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Video Editing Tips</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Trim your video to remove unwanted sections</li>
          <li>Adjust playback speed for creative effects</li>
          <li>Choose the appropriate export format based on where you'll share the video</li>
          <li>Higher quality exports will result in larger file sizes</li>
        </ul>
      </div>
    </div>
  )
}
