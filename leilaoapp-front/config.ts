import Constants from 'expo-constants';

const manifest = Constants.expoConfig || (Constants as any).manifest2;
const debuggerHost = manifest?.hostUri; 
const ip = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

export const API_URL = `http://${ip}:8000`;

console.log("Conectando na API pelo endereço:", API_URL);