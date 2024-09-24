import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './Views/Upload';
import Upload from './Views/Upload';
import Create from './Views/Create';
import View from './Views/View';
import Manage from './Views/Manage';
import FolderContent from './Views/FolderContent';
import ScreenManager from './Views/ScreenManager';
import { Provider } from 'react-redux'
import store from './store'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <Router>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/create" element={<Create />} />
          <Route path="/view" element={<View />} />
          <Route path="/selectScreen" element={<Manage />} />
          <Route path="/folderContent/:folderName" element={<FolderContent />} />
          <Route path="/manageScreen/:screenID" element={<ScreenManager />} />
      </Routes>
  </Router>
  </Provider>
);

