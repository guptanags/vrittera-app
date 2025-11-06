import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import api from '../services/api';

type Props = {
  onUploadComplete?: (fileUrl: string) => void;
};

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder: React.FC<Props> = ({ onUploadComplete }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const dirs = RNFS.TemporaryDirectoryPath || RNFS.CachesDirectoryPath;
      const path = `${dirs}/vrittera-${Date.now()}.m4a`;

      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };

      const result = await audioRecorderPlayer.startRecorder(path, audioSet);
      audioRecorderPlayer.addRecordBackListener((e) => {
        // noop; could update elapsed time here
        return;
      });

      setFilePath(result);
      setRecording(true);
    } catch (err) {
      Alert.alert('Recording error', String(err));
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setFilePath(result);
    } catch (err) {
      Alert.alert('Stop error', String(err));
    }
  };

  const uploadRecording = async () => {
    if (!filePath) return Alert.alert('No recording', 'Please record audio first.');
    setLoading(true);
    try {
      const filename = filePath.split('/').pop() || `vrittera-${Date.now()}.m4a`;

      // Request presigned URL from backend
      const presignResp = await api.post('/v1/uploads/presign', {
        filename,
        contentType: 'audio/m4a',
      });

      const { uploadUrl, fileUrl } = presignResp;
      if (!uploadUrl) throw new Error('No upload URL returned from server');

      // Read file as binary
      const fileStat = await RNFS.stat(filePath);
      const file = await RNFS.readFile(filePath, 'base64');

      // PUT to presigned URL
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'audio/m4a',
        },
        body: Buffer.from(file, 'base64'),
      });
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      // Notify backend to process the file (optional)
      await api.post('/v1/interviews', {
        fileUrl,
        metadata: { source: 'mobile' },
      });

      onUploadComplete && onUploadComplete(fileUrl);
      Alert.alert('Upload complete', 'Your recording was uploaded successfully.');
    } catch (err) {
      Alert.alert('Upload error', String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <Text style={{ marginBottom: 12 }}>{recording ? 'Recording...' : 'Ready to record'}</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {!recording ? (
          <TouchableOpacity
            onPress={startRecording}
            style={{ padding: 12, backgroundColor: '#007bff', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Record</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopRecording}
            style={{ padding: 12, backgroundColor: '#dc3545', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Stop</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={uploadRecording}
          disabled={loading || recording || !filePath}
          style={{
            padding: 12,
            backgroundColor: loading || !filePath ? '#6c757d' : '#28a745',
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Upload</Text>}
        </TouchableOpacity>
      </View>
      {filePath ? <Text style={{ marginTop: 12, fontSize: 12 }}>{filePath}</Text> : null}
    </View>
  );
};

export default AudioRecorder;