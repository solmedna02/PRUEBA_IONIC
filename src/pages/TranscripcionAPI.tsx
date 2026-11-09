import { Clipboard } from '@capacitor/clipboard';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonTextarea,
  IonLoading,
  IonToast,
  IonAlert
} from '@ionic/react';
import {
  micOutline,
  stopOutline,
  copyOutline,
  trashOutline,
  documentTextOutline
} from 'ionicons/icons';
import { useRef, useState } from 'react';


import { transcribirAudio } from '../services/transcripcionAPI';

const TranscripcionAPI: React.FC = () => {
  const [grabando, setGrabando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [audioGrabado, setAudioGrabado] = useState<Blob | null>(null);

  const grabador = useRef<MediaRecorder | null>(null);
  const fragmentos = useRef<Blob[]>([]);
  const audioStream = useRef<MediaStream | null>(null);

  const iniciarGrabacion = async () => {
    try {
      setAudioGrabado(null);
      setTexto('');
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('El micrófono no está disponible');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      audioStream.current = stream;

      const recorder = new MediaRecorder(stream);
      grabador.current = recorder;
      fragmentos.current = [];

      recorder.ondataavailable = (evento) => {
        if (evento.data.size > 0) {
          fragmentos.current.push(evento.data);
        }
      };

      recorder.onstop = () => {
        const audio = new Blob(fragmentos.current, {
          type: recorder.mimeType
        });

        audioStream.current?.getTracks().forEach(
          track => track.stop()
        );

        audioStream.current = null;

        if (!audio.size) {
          setError('No se pudo capturar el audio');
          return;
        }

        setAudioGrabado(audio);
        setMensaje('Audio grabado correctamente');
      };

      recorder.start();
      setGrabando(true);
    } catch (err) {
      audioStream.current?.getTracks().forEach(
        track => track.stop()
      );
      audioStream.current = null;

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo acceder al micrófono'
      );
    }
  };

  const detenerGrabacion = () => {
    if (grabador.current?.state === 'recording') {
      grabador.current.stop();
      setGrabando(false);
    }
  };

  const transcribir = async () => {
    if (!audioGrabado) {
      setError('Primero debes grabar un audio');
      return;
    }

    setProcesando(true);

    try {
      const resultado = await transcribirAudio(audioGrabado);
      setTexto(resultado);
      setMensaje('Transcripción completada');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al transcribir'
      );
    } finally {
      setProcesando(false);
    }
  };

  const copiarTexto = async () => {
    try {
      await Clipboard.write({ string: texto });
      setMensaje('Texto copiado');
    } catch {
      setError('No se pudo copiar el texto');
    }
  };

  const limpiarTexto = () => {
    setTexto('');
    setAudioGrabado(null);
    setMensaje('');
    setError('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>Transcripción API</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Grabación de voz</h2>
            <p>
              Graba tu voz para transcribirla mediante ElevenLabs.
            </p>

            <p>
              Estado: {
                grabando
                  ? 'Grabando...'
                  : procesando
                    ? 'Procesando...'
                    : audioGrabado
                      ? 'Audio listo para transcribir'
                      : 'En espera'
              }
            </p>

            <IonButton
              expand="block"
              color="success"
              disabled={grabando || procesando}
              onClick={iniciarGrabacion}
            >
              <IonIcon slot="start" icon={micOutline} />
              Grabar
            </IonButton>

            <IonButton
              expand="block"
              color="danger"
              disabled={!grabando}
              onClick={detenerGrabacion}
            >
              <IonIcon slot="start" icon={stopOutline} />
              Detener
            </IonButton>

            <IonButton
              expand="block"
              disabled={!audioGrabado || grabando || procesando}
              onClick={transcribir}
            >
              <IonIcon slot="start" icon={documentTextOutline} />
              Transcribir
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Texto transcrito</h2>

            <IonTextarea
              value={texto}
              readonly
              autoGrow
              rows={6}
              placeholder="Aquí aparecerá el texto..."
            />

            <IonButton
              expand="block"
              disabled={!texto}
              onClick={copiarTexto}
            >
              <IonIcon slot="start" icon={copyOutline} />
              Copiar
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              disabled={grabando || procesando}
              onClick={limpiarTexto}
            >
              <IonIcon slot="start" icon={trashOutline} />
              Limpiar
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonLoading
          isOpen={procesando}
          message="Transcribiendo audio..."
        />

        <IonToast
          isOpen={!!mensaje}
          message={mensaje}
          duration={2000}
          onDidDismiss={() => setMensaje('')}
        />

        <IonAlert
          isOpen={!!error}
          header="Error"
          message={error}
          buttons={['Aceptar']}
          onDidDismiss={() => setError('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default TranscripcionAPI;
