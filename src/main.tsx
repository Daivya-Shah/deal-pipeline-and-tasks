import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// PrimeReact CSS
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById("root")!).render(<App />);
