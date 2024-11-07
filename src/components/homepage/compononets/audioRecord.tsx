'use client'

import { Cross1Icon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import * as React from 'react'

interface audioRecordComponentProps {
  title: string
  recording1: boolean
  setRecording1: React.Dispatch<React.SetStateAction<boolean>>
  audioUrl1: string | null
  setAudioUrl1: React.Dispatch<React.SetStateAction<string | null>>
  playing1: boolean
  setPlaying1: React.Dispatch<React.SetStateAction<boolean>>
  startRecording: (
    setRecording: React.Dispatch<React.SetStateAction<boolean>>,
    setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>,
  ) => void
  stopRecording: (
    setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setRecording: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void
  id: string
}

const AudioRecordComponent: React.FC<audioRecordComponentProps> = ({
  title,
  recording1,
  setRecording1,
  audioUrl1,
  setAudioUrl1,
  startRecording,
  stopRecording,
  id,
}: audioRecordComponentProps) => {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <p className="text-gray-700">
        {/* Please say, "ጥቂት ቁሳዊ አካል ከጨረቃ በታች ባለ ጠባብ ክፍል ውስጥ አገኘሁ"
         */}
        {title}
      </p>
      <div className="flex">
        <button
          type="button"
          className={`mt-2 px-4 py-2 rounded-md text-white ${
            recording1 ? 'bg-red-500' : 'bg-blue-500'
          } flex items-center`}
          onClick={() => startRecording(setRecording1, setAudioUrl1)}
          disabled={recording1}
        >
          <SpeakerLoudIcon className="size-5 mr-2" />
          {recording1 ? 'Recording...' : 'Start Recording'}
        </button>
        {recording1 && (
          <button
            type="button"
            className="ml-2 mt-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 flex items-center"
            onClick={() => stopRecording(setAudioUrl1, setRecording1)}
            disabled={!recording1}
          >
            <Cross1Icon className="size-5 mr-2" /> Stop
          </button>
        )}

        {/* {audioUrl1 && (
            <button
                type="button"
                className="ml-2 mt-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center"
                onClick={() => {
                if (playing1) {
                    setPlaying1(false);
                    (document.getElementById(id) as HTMLAudioElement)?.pause();
                } else {
                    setPlaying1(true);
                    (document.getElementById(id) as HTMLAudioElement)?.play();
                }
                }}
            >
                {
                playing1 ?
                <> <Cross1Icon className="w-5 h-5 mr-2" /> Stop </> :
                <> <TriangleRightIcon className="w-5 h-5 mr-2" /> Play Recording</>
                }
            </button>
            )} */}
      </div>
      {audioUrl1 && (
        <audio id={id} controls src={audioUrl1 || undefined} className="self-center mt-1" />
      )}
    </div>
  )
}

export default AudioRecordComponent
