import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';
import '@mantine/core/styles.css';
import App from './Views/UploadFiles';
import Upload from './Views/UploadFiles';
import ViewFiles from './Views/ViewFolders';
import Manage from './Views/ManageScreens';
import FolderContent from './Views/FolderContent';
import UserActions from './Views/UserActions';
import UserCreation from './Views/UserCreation';
import UserManagment from './Views/UserManagment';
import Login from './Components/Auth/Login';
import CreateSlideshow from './Views/CreateSlideshow';
import ViewAllSlideshows from './Views/ViewAllSlideshows';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import store from './store'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from "./Views/Test";

const root = ReactDOM.createRoot(document.getElementById('root'));

const themeOverride = {
  colors: {
    blue: ['#f0f0ff', '#d0d0ff', '#b0b0ff', '#9090ff', '#7070ff', '#5050ff', '#282262', '#18143f', '#0000cc', '#000099'],
  },
  primaryColor: 'blue', 
  globalStyles: (theme) => ({
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    body: {
      borderColor: theme.colors.blue[6], 
    },
    'input, button, select, textarea': {
      borderColor: theme.colors.blue[6],  
    },
    '.mantine-Button-root': {
      border: `3px solid ${theme.colors.blue[6]}`, 
    }
  }),
};

root.render(
  <MantineProvider theme={themeOverride}>
    <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<App />} />
                <Route path="/dashboard/upload" element={<Upload />} />
                <Route path="/dashboard/view" element={<ViewFiles />} />
                <Route path="/dashboard/selectScreen" element={<Manage />} />
                <Route path="/dashboard/folderContent/:folderName" element={<FolderContent />} />
                <Route path="/dashboard/users" element={<UserActions />} />
                <Route path="/dashboard/createUser" element={<UserCreation />} />
                <Route path="/dashboard/viewAllUsers" element={<UserManagment />} />
                <Route path="/dashboard/createSlideshow/" element={<CreateSlideshow />} />
                <Route path="/dashboard/" element={<ViewAllSlideshows />} />
                <Route path="/test/" element={<Test />} />
            </Routes>
        </Router>
    </Provider>
  </MantineProvider>
);
