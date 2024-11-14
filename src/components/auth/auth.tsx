'use client'

import { Spinner } from '@radix-ui/themes'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useRef, useState } from 'react'

import AudioRecordComponent from '../homepage/compononets/audioRecord'

const VoiceBiometricAuthentication: React.FC = () => {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState<string>('')
  const router = useRouter()

  React.useEffect(() => {
    const customerId = localStorage.getItem('customerID')
    if (customerId) {
      setCustomerId(customerId)
    }
    else {
      router.push('/')
    }
  })

  const startRecording = async () => {
    try {
      setAudioUrl(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.start()
      setRecording(true)
      audioChunksRef.current = []
    }
    catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Microphone permission is required to record audio.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(audioUrl)
      }
      setRecording(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!audioUrl) {
      alert('Please record the audio')
      return
    }

    const formData = new FormData()
    const audioBlob
      = audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: 'audio/wav' })
        : null

    if (audioBlob) {
      formData.append('audio_file', audioBlob, 'recordedAudio.wav')
    }

    formData.append('customer_id', customerId)

    try {
      setLoading(true)
      const response = await fetch(
        'https://54.162.136.11/api/v1/voice/voice_biometrics/',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (response.ok) {
        // alert('Submitted successfully');
        const responseData = await response.json()
        setResult(responseData?.result || 'No result found')
      }
      else {
        alert('Submission failed')
      }
    }
    catch (error) {
      console.error('Error submitting form data:', error)
      alert('An error occurred during submission. Please try again later.')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <img src="kifiya.jpeg" alt="Logo" className="w-20 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Voice Biometrics</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <AudioRecordComponent
              audioUrl1={audioUrl}
              playing1={isPlaying}
              setPlaying1={setIsPlaying}
              setAudioUrl1={setAudioUrl}
              recording1={recording}
              setRecording1={setRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              id="audio1AUTH"
              title='Please say, "ke be te che, la ma na ko, si ti ha ta" and record'
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <Spinner /> loading
                </>
              ) : (
                <span>Authenticate</span>
              )}
            </button>

            {result && (
              <div className="mt-4 p-4 bg-gray-200 text-gray-800 rounded-md">
                <h3 className="font-semibold text-lg">Result:</h3>
                <p>{result}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default VoiceBiometricAuthentication
