import { SpeechRecognition } from '@capgo/capacitor-speech-recognition';

export const iniciarReconocimiento = async (): Promise<void> => {
  const { available } = await SpeechRecognition.available();

  if (!available) {
    throw new Error('Reconocimiento de voz no disponible');
  }

  let permisos = await SpeechRecognition.checkPermissions();

  if (permisos.speechRecognition !== 'granted') {
    permisos = await SpeechRecognition.requestPermissions();
  }

  if (permisos.speechRecognition !== 'granted') {
    throw new Error('Debes permitir el acceso al micrófono');
  }

  await SpeechRecognition.start({
    language: 'es-EC',
    maxResults: 1,
    partialResults: true,
    popup: false
  });
};

export const detenerReconocimiento = async (): Promise<void> => {
  await SpeechRecognition.stop();
};

export { SpeechRecognition };
