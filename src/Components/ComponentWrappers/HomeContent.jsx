import UploadFiles from "../HomeViews/UploadFiles";
import ViewFiles from "../HomeViews/ViewFiles";
import CreateFolders from "../HomeViews/CreateFolders";
import ManageScreens from "../HomeViews/ManageScreens";
import { useSelector } from 'react-redux'

export default function HomeContent() {


    return (
        <div className="home-content">
            {/* {activeComponent == "upload" && <UploadFiles/>}
            {activeComponent == "view" && <ViewFiles/>}
            {activeComponent == "create" && <CreateFolders/>}
            {activeComponent == "manage" && <CreateFolders/>} */}
        </div>
    );
  }
  
  