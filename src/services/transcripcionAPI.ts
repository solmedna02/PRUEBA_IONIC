
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const transcribirAudio = async (
  audio: Blob
): Promise<string> => {
  if (!API_KEY) {
    throw new Error('No se configuró la API Key');
  }

  const formData = new FormData();

  const extension = audio.type.includes('mp4') ? 'mp4' : 'webm';

  formData.append('file', audio, `grabacion.${extension}`);
  formData.append('model_id', 'scribe_v2');

  const respuesta = await fetch(
    'https://api.elevenlabs.io/v1/speech-to-text',
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY
      },
      body: formData
    }
  );

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => ({}));

    throw new Error(
      error.detail?.message ||
      'Error al transcribir el audio'
    );
  }

  const resultado = await respuesta.json();

  return resultado.text;
};
