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
  trashOutline
} from 'ionicons/icons';
import { useEffect, useState } from 'react';

import {
  SpeechRecognition,
  iniciarReconocimiento,
  detenerReconocimiento
} from '../services/transcripcionNativa';

const TranscripcionNativa: React.FC = () => {
  const [escuchando, setEscuchando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    const listeners:{ remove: () => Promise<void> }[] = [];

    const configurarEventos = async () => {
      const resultado = await SpeechRecognition.addListener(
        'partialResults',
        (data) => {
          if (activo) {
            setTexto(
              data.accumulatedText ||
              data.matches?.[0] ||
              ''
            );
          }
        }
      );

      listeners.push(resultado);

      const estado = await SpeechRecognition.addListener(
        'listeningState',
        (data) => {
          if (activo) {
            setEscuchando(data.status === 'started');
          }
        }
      );

      listeners.push(estado);

      const fallo = await SpeechRecognition.addListener(
        'error',
        (data) => {
          if (activo) {
            setError(data.message || 'Error de reconocimiento');
            setEscuchando(false);
          }
        }
      );

      listeners.push(fallo);
    };

    void configurarEventos().catch(() => {
      if (activo) {
        setError('No se pudieron configurar los eventos');
      }
    });

    return () => {
      activo = false;

      listeners.forEach((listener) => {
        void listener.remove();
      });

      void detenerReconocimiento().catch(() => {});
    };
  }, []);

  const iniciar = async () => {
    setProcesando(true);
    setTexto('');

    try {
      await iniciarReconocimiento();
      setEscuchando(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar el reconocimiento'
      );
    } finally {
      setProcesando(false);
    }
  };

  const detener = async () => {
    setProcesando(true);

    try {
      await detenerReconocimiento();
      setEscuchando(false);
      setMensaje('Reconocimiento detenido');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo detener el reconocimiento'
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
          <IonTitle>Transcripción Nativa</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <h2>Reconocimiento de voz</h2>
            <p>
              Reconoce tu voz mediante el plugin nativo.
            </p>

            <p>
              Estado: {
                escuchando
                  ? 'Escuchando...'
                  : procesando
                    ? 'Procesando...'
                    : 'En espera'
              }
            </p>

            <IonButton
              expand="block"
              color="success"
              disabled={escuchando || procesando}
              onClick={iniciar}
            >
              <IonIcon slot="start" icon={micOutline} />
              Iniciar
            </IonButton>

            <IonButton
              expand="block"
              color="danger"
              disabled={!escuchando || procesando}
              onClick={detener}
            >
              <IonIcon slot="start" icon={stopOutline} />
              Detener
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <h2>Texto reconocido</h2>

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
              disabled={escuchando || procesando}
              onClick={limpiarTexto}
            >
              <IonIcon slot="start" icon={trashOutline} />
              Limpiar
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonLoading
          isOpen={procesando}
          message="Preparando reconocimiento..."
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

export default TranscripcionNativa;
