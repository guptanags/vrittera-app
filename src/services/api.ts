// src/services/api.ts
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { API_BASE_URL } from '@env';


async function getIdToken() {
  const user = auth().currentUser;
  if (!user) return null;



  const idToken = await user.getIdToken();
  console.log('Firebase ID Token:', idToken);
  return idToken;
}

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

client.interceptors.request.use(async (cfg) => {
  const token = await getIdToken();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export async function presignUpload(filename: string, contentType: string) {
  const resp = await client.post('/v1/uploads/presign', { filename, contentType });
  return resp.data; // { uploadUrl, fileUrl, objectName }
}

export async function createInterviewJob(payload: { objectName?: string; fileUrl?: string; metadata?: any }) {
  const resp = await client.post('/v1/interviews', payload);
  return resp.data; // { ok, jobId }
}

export async function getInterviewJob(jobId: string) {
  const resp = await client.get(`/v1/interviews/${jobId}`);
  return resp.data;
}

export async function resumeOptimize(fileUrl: string, job?: { jobId?: string }, metadata?: any) {
  // endpoint that triggers resume optimization on backend (assume exists /v1/resumes or reuse interviews)
  const resp = await client.post('/v1/resumes/optimize', { fileUrl, metadata, job });
  return resp.data;
}

export default client;
