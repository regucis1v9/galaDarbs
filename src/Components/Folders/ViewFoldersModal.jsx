import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { Skeleton } from "@mantine/core";

export default function ViewFoldersModal() {
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]); // State to store files
  const [isLoadingFolders, setIsLoadingFolders] = useState(true); // Loading state for folders
  const [isLoadingFiles, setIsLoadingFiles] = useState(false); // Loading state for files
  const [selectedFolder, setSelectedFolder] = useState(null); // State to track the selected folder
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost/api/listFolders", {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setFolders(data.folders);
        setIsLoadingFolders(false);
      })
      .catch((error) => {
        console.error("Error fetching folder list:", error);
        setIsLoadingFolders(false); // Error loading folders
      });
  }, [token]);

  useEffect(() => {
    dispatch(updateActiveComponent('view'));
  }, [dispatch]);

  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchFiles = async (folderName) => {
    setIsLoadingFiles(true); // Set loading state for files
    try {
      const response = await fetch('http://localhost/api/retrieveFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ folder_name: folderName }),
      });

      if (!response.ok) {
        throw new Error('Error finding files');
      }

      const data = await response.json();
      setFiles(data.files || []); // Store fetched files, handle empty case
      setSelectedFolder(folderName); // Set the selected folder
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoadingFiles(false); // Reset loading state for files
    }
  };

const handleFolderClick = (folder) => {
    setSelectedFolder(folder); // Set the selected folder before fetching
    fetchFiles(folder); // Fetch files for the selected folder
};
  // Optional: Reset function to go back to the folder selection state
  const resetView = () => {
    setSelectedFolder(null);
    setFiles([]);
  };

  return (
    <div className="manage-main">
      <div className="search-bar">
        <FontAwesomeIcon className="search-icon" icon={faSearch} />
        <input 
          type="text" 
          placeholder="Meklēt mapes..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      {selectedFolder ? ( 
          <div>
              <button onClick={resetView}>Back to Folders</button> 
              <h2>{selectedFolder}</h2> {/* Show the selected folder name */}
              {isLoadingFiles ? ( 
                <div className="folder-main">
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                </div>                
              ) : (
                <div className="folder-main">
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <img 
                        key={index} 
                        src={`http://localhost${file}`}  
                        alt={`File ${file}`} 
                        className={`preview-image`} 
                        onClick={() => console.log(`File clicked: ${file}`)} 
                      />
                    ))
                  ) : (
                    <p className="search-error">Nav pieejamu failu šajā mapē.</p> 
                  )}
                </div>
              )}
          </div>
      ) : ( 
          <div className="folder-main">
              {isLoadingFolders ? (
                <div className="folder-main">
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                  <Skeleton w={100} h={100}></Skeleton>
                </div>
              ) : (
                <>
                  {filteredFolders.length > 0 && !isLoadingFiles && (
                    filteredFolders.map((folder, index) => (
                      <button 
                        key={index} 
                        className="folder-wrapper" 
                        onClick={() => handleFolderClick(folder)} 
                      >
                        <div title={folder}>
                          <div className="folder-icon">
                            <FontAwesomeIcon className="black" icon={faFolder} />
                          </div>
                          <div className="folder-title">{folder}</div>
                        </div>
                      </button>
                    ))
                  )}
                  {filteredFolders.length === 0 && !isLoadingFiles && (
                    <p className="search-error">Nav pieejamu mapju.</p>
                  )}
                </>
              )}
          </div>
      )}
    </div>
  );
}
