
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import { micOutline, phonePortraitOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Transcriptor de Voz</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>Bienvenido</h2>
        <p>Selecciona una modalidad de transcripción.</p>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Transcripción API</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Transcribe tu voz utilizando ElevenLabs.</p>
            <IonButton
              expand="block"
              onClick={() => navigate('/transcripcion-api')}
            >
              <IonIcon slot="start" icon={micOutline} />
              Iniciar
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Transcripción Nativa</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Reconoce tu voz mediante el plugin nativo.</p>
            <IonButton
              expand="block"
              onClick={() => navigate('/transcripcion-nativa')}
            >
              <IonIcon slot="start" icon={phonePortraitOutline} />
              Iniciar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
