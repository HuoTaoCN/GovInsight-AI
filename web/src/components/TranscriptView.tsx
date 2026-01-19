import React, { useState, useRef } from 'react';
import { User, Headphones, Building2, Upload, Mic, MicOff, Loader2, Edit2, Save } from 'lucide-react';

interface TranscriptViewProps {
  content: string;
  onUpdate?: (newContent: string) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ content, onUpdate }) => {
  // Simple parser to split dialogue based on common prefixes
  const lines = content.trim().split('\n').filter(line => line.trim() !== '');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  
  // Audio Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- File Upload Logic ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      if (onUpdate && data.text) {
        // Append new transcription to existing content
        const newText = content ? `${content}\n\n[上传录音转写]\n${data.text}` : data.text;
        onUpdate(newText);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('音频转写失败，请检查后端服务');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // --- Real-time Recording Logic (Simulated with Short Chunks) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioChunk(audioBlob);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access denied:', err);
      alert('无法访问麦克风');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioChunk = async (blob: Blob) => {
    setIsUploading(true); // Reuse uploading spinner for processing
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    try {
      const response = await fetch('/api/audio/stream', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Stream failed');

      const data = await response.json();
      if (onUpdate && data.text) {
        const newText = content ? `${content}\n${data.text}` : data.text;
        onUpdate(newText);
      }
    } catch (error) {
      console.error('Stream processing error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex-1">通话录音转写</h3>
        
        {/* Upload Button */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="audio/*" 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isRecording || isEditing}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
          title="上传音频文件"
        >
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        </button>

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isUploading || isEditing}
          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
            isRecording 
              ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-50'
          }`}
          title={isRecording ? "停止录音" : "开始实时录音"}
        >
          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        {/* Edit Toggle Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`p-1.5 rounded transition-all flex items-center gap-1 ${
            isEditing
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title={isEditing ? "完成编辑" : "手动修改"}
        >
          {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
        </button>
      </div>

      {/* Content Area - Switch between Preview and Edit Mode */}
      <div ref={scrollRef} className="space-y-4 font-mono text-sm flex-1 overflow-y-auto pr-2 pb-4">
        {isEditing ? (
          /* Edit Mode: Full Textarea */
          <textarea
            value={content}
            onChange={(e) => onUpdate && onUpdate(e.target.value)}
            className="w-full h-full min-h-[300px] text-sm leading-relaxed text-gray-700 p-3 bg-white rounded border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none font-mono shadow-inner"
            placeholder="在此处手动编辑全文..."
            autoFocus
          />
        ) : (
          /* Preview Mode: Formatted Bubbles */
          <>
            {lines.length === 0 && (
              <div 
                className="text-gray-400 text-center py-8 text-xs italic cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => setIsEditing(true)}
              >
                暂无录音内容，点击此处或上方按钮开始编辑...
              </div>
            )}
            
            <div 
              className="space-y-4 cursor-text"
              onClick={() => setIsEditing(true)} // Click anywhere on bubbles to edit
              title="点击任意位置进行修改"
            >
              {lines.map((line, idx) => {
                let role = 'unknown';
                let text = line;
                
                if (line.startsWith('市民：')) {
                  role = 'citizen';
                  text = line.replace('市民：', '');
                } else if (line.startsWith('话务员：')) {
                  role = 'agent';
                  text = line.replace('话务员：', '');
                } else if (line.includes('：')) {
                  // Generic department handling
                  role = 'dept';
                }

                return (
                  <div key={idx} className="flex gap-3 group">
                    <div className="shrink-0 mt-0.5">
                      {role === 'citizen' && <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><User size={16} className="text-blue-600"/></div>}
                      {role === 'agent' && <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><Headphones size={16} className="text-purple-600"/></div>}
                      {role === 'dept' && <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Building2 size={16} className="text-orange-600"/></div>}
                      {role === 'unknown' && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-xs text-gray-500">?</span></div>}
                    </div>
                    <div className="flex-1 group-hover:bg-gray-50 rounded -ml-2 pl-2 py-1 transition-colors">
                      <p className="text-gray-800 leading-relaxed">{text}</p>
                      {role !== 'unknown' && <span className="text-xs text-gray-400 block mt-1">{line.split('：')[0]}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
