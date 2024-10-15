import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.scss';
import '@mantine/core/styles.css';
import App from './Views/UploadFiles';
import Upload from './Views/UploadFiles';
import ViewFiles from './Views/ViewFolders';
import Manage from './Views/ManageScreens';
import FolderContent from './Views/FolderContent';
import ScreenManager from './Views/ScreenManager';
import UserActions from './Views/UserActions';
import UserCreation from './Views/UserCreation';
import UserManagment from './Views/UserManagment';
import ManageSingleUser from './Views/ManageSingleUser';
import Login from './Components/Auth/Login';
import Popup from './Components/Mantine/Popup'
import CreateSlideshow from './Views/CreateSlideshow'
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux'
import store from './store'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MantineProvider>
    <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<App />} />
                <Route path="/dashboard/upload" element={<Upload />} />
                <Route path="/dashboard/view" element={<ViewFiles />} />
                <Route path="/dashboard/selectScreen" element={<Manage />} />
                <Route path="/dashboard/folderContent/:folderName" element={<FolderContent />} />
                <Route path="/dashboard/manageScreen/:screenID" element={<ScreenManager />} />
                <Route path="/dashboard/users" element={<UserActions />} />
                <Route path="/dashboard/createUser" element={<UserCreation />} />
                <Route path="/dashboard/viewAllUsers" element={<UserManagment />} />
                <Route path="/dashboard/viewUser/:id" element={<ManageSingleUser />} />
                <Route path="/dashboard/CreateSlideshow/" element={<CreateSlideshow />} />
                <Route path="/test" element={<Popup />} />
            </Routes>
        </Router>
    </Provider>
  </MantineProvider>
);

