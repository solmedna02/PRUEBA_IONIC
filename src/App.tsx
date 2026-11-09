
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';

import Inicio from './pages/Home';
import TranscripcionAPI from './pages/TranscripcionAPI';
import TranscripcionNativa from './pages/TranscripcionNativa';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/inicio" element={<Inicio />} />
        <Route
          path="/transcripcion-api"
          element={<TranscripcionAPI />}
        />
        <Route
          path="/transcripcion-nativa"
          element={<TranscripcionNativa />}
        />
        <Route path="/" element={<Navigate to="/inicio" replace />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
