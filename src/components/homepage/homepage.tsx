'use client'

import React, { useState, useRef } from 'react';
import AudioRecordComponent from './compononets/audioRecord';
import { Spinner } from '@radix-ui/themes'


const VoiceBiometricVerification: React.FC = () => {
  const [loading, setLoading] = React.useState(false)
  const [customerID, setCustomerID] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loanProduct, setLoanProduct] = useState<string>('');
  const [audioUrl1, setAudioUrl1] = useState<string | null>(null);
  const [audioUrl2, setAudioUrl2] = useState<string | null>(null);
  const [audioUrl3, setAudioUrl3] = useState<string | null>(null);


  const [playing1, setPlaying1] = useState<boolean>(false);
  const [playing2, setPlaying2] = useState<boolean>(false);
  const [playing3, setPlaying3] = useState<boolean>(false);

  const [recording1, setRecording1] = useState<boolean>(false);
  const [recording2, setRecording2] = useState<boolean>(false);
  const [recording3, setRecording3] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async (setRecording: React.Dispatch<React.SetStateAction<boolean>>, setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>) => {
    setAudioUrl(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    setRecording(true);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };
  };

  const stopRecording = (
    setAudioUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setRecording: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!audioUrl1 || !audioUrl2 || !audioUrl3) {
      alert('Please record all three audio samples');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      formData.append('customer_id', customerID);
      formData.append('name', name);
      formData.append('loan_product', loanProduct);

      const audioBlob1 = await fetch(audioUrl1).then(r => r.blob());
      const audioBlob2 = await fetch(audioUrl2).then(r => r.blob());
      const audioBlob3 = await fetch(audioUrl3).then(r => r.blob());

      formData.append('audio_file_1', audioBlob1, 'audio1.wav');
      formData.append('audio_file_2', audioBlob2, 'audio2.wav');
      formData.append('audio_file_3', audioBlob3, 'audio3.wav');

      const response = await fetch('http://aeb1cd586b3fe427c93eecedb8c7fa1f-1727048564.us-east-1.elb.amazonaws.com/upload-audio/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Data submitted successfully');
      } else {
        alert('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('An error occurred during submission');
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg m-4">
        <div className="flex items-center justify-center mb-6">
          <img src="/kifiya.jpeg" alt="Logo" className="w-20 h-15 mr-4 " />
          <h2 className="text-2xl font-semibold text-gray-700">Voice Biometrics</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customer_id" className="block text-gray-600 font-medium">
              Customer ID
            </label>
            <input
              type="text"
              id="customer_id"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-gray-600 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="loan_product" className="block text-gray-600 font-medium">
              Loan Product
            </label>
            <input
              type="text"
              id="loan_product"
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={loanProduct}
              onChange={(e) => setLoanProduct(e.target.value)}
              required
            />
          </div>

          {/* Recording Section 1 */}
          <AudioRecordComponent 
                  title= 'Please say, " ጥቂት ቁሳዊ አካል ከጨረቃ በታች ባለ ጠባብ ክፍል ውስጥ አገኘሁ" and record'
                  audioUrl1={audioUrl1} 
                  playing1 = {playing1} 
                  recording1={recording1} 
                  setAudioUrl1={setAudioUrl1} 
                  setPlaying1={setPlaying1} 
                  setRecording1={setRecording1}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  id='audioPreview1'
                  />
          <AudioRecordComponent 
                  title= 'Please say, "ጨጨብሳ፣ ቋንጣ እና ቂጣ በቅጡ ማኘክ ጥሩ ነው" and record'
                  audioUrl1={audioUrl2} 
                  playing1 = {playing2} 
                  recording1={recording2} 
                  setAudioUrl1={setAudioUrl2} 
                  setPlaying1={setPlaying2} 
                  setRecording1={setRecording2}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  id='audioPreview2'
                  />
          <AudioRecordComponent 
                  title= 'Please say, "እራሴን በገዛ እራሴ ካላቆለጳጰስኩኝ ማን ያቆለጳጵሰኛል" and record'
                  audioUrl1={audioUrl3} 
                  playing1 = {playing3} 
                  recording1={recording3} 
                  setAudioUrl1={setAudioUrl3} 
                  setPlaying1={setPlaying3} 
                  setRecording1={setRecording3}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  id='audioPreview3'
                  />

          {/* <div className="mb-4">
            <p className="text-gray-700">
              Please say, "ጨጨብሳ፣ ቋንጣ እና  ቂጣ በቅጡ ማኘክ ጥሩ ነው"
            </p>
            <button
              type="button"
              className={`mt-2 px-4 py-2 rounded-md text-white ${
                recording2 ? 'bg-red-500' : 'bg-blue-500'
              } hover:bg-blue-600 flex items-center`}
              onClick={() => startRecording(setRecording2, setAudioUrl2)}
              disabled={recording2}
            >
              <SpeakerLoudIcon className="w-5 h-5 mr-2" />
              {recording2 ? 'Recording...' : 'Start Recording'}
            </button>
            <button
              type="button"
              className="ml-2 mt-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 flex items-center"
              onClick={() => stopRecording(setAudioUrl2, setRecording2)}
              disabled={!recording2}
            >
              <Cross1Icon className="w-5 h-5 mr-2" />
              Stop
            </button>
            {audioUrl2 && (
              <button
                type="button"
                className="ml-2 mt-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center"
                onClick={() => (document.getElementById('audioPreview1') as HTMLAudioElement)?.play()}
              >
                <TriangleRightIcon className="w-5 h-5 mr-2" />
                Play Recording
              </button>
            )}
            <audio id="audioPreview2" controls src={audioUrl2 || undefined} className="hidden mt-2" />
          </div>

          <div className="mb-4">
            <p className="text-gray-700">
              Please say, "እራሴን በገዛ እራሴ ካላቆለጳጰስኩኝ ማን ያቆለጳጵሰኛል"
            </p>
            <button
              type="button"
              className={`mt-2 px-4 py-2 rounded-md text-white ${
                recording3 ? 'bg-red-500' : 'bg-blue-500'
              } hover:bg-blue-600 flex items-center`}
              onClick={() => startRecording(setRecording3, setAudioUrl3)}
              disabled={recording3}
            >
              <SpeakerLoudIcon className="w-5 h-5 mr-2" />
              {recording3 ? 'Recording...' : 'Start Recording'}
            </button>
            <button
              type="button"
              className="ml-2 mt-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 flex items-center"
              onClick={() => stopRecording(setAudioUrl3, setRecording3)}
              disabled={!recording3}
            >
              <Cross1Icon className="w-5 h-5 mr-2" />
              Stop
            </button>
            {audioUrl3 && (
              <button
                type="button"
                className="ml-2 mt-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 flex items-center"
                onClick={() => (document.getElementById('audioPreview1') as HTMLAudioElement)?.play()}
              >
                <TriangleRightIcon className="w-5 h-5 mr-2" />
                Play Recording
              </button>
            )}
            <audio id="audioPreview3" controls src={audioUrl3 || undefined} className="hidden mt-2" />
          </div> */}



          <div className="text-center">
            <button type="submit" className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={loading}>
              {loading ? <><Spinner /> loading</> : <span>Calculate</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoiceBiometricVerification;