import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Capacitor} from '@capacitor/core';
import App from './App.tsx';
import './index.css';

// Light native polish on Android / iOS. Guarded so the web build is unaffected.
if (Capacitor.isNativePlatform()) {
  void (async () => {
    try {
      const {StatusBar, Style} = await import('@capacitor/status-bar');
      await StatusBar.setStyle({style: Style.Light});
    } catch {
      // StatusBar is best-effort; ignore if unavailable on the platform.
    }
  })();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
