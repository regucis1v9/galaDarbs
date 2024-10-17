import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateImageLink } from '../../actions/imageActions';
import { Skeleton, Button } from "@mantine/core";

export default function ViewFoldersModal({ selectedButtonId, closeModal }) {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const token = localStorage.getItem('token');

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
        setIsLoadingFolders(false);
      });
  }, [token]);

  const fetchFiles = async (folderName) => {
    setIsLoadingFiles(true);
    try {
      const response = await fetch('http://localhost/api/retrieveFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ folder_name: folderName }),
      });

      if (!response.ok) {
        throw new Error('Error finding files');
      }

      const data = await response.json();
      setFiles(data.files || []);
      setSelectedFolder(folderName);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    fetchFiles(folder);
  };

  const handleImageClick = (imageLink) => {
    dispatch(updateImageLink(selectedButtonId, imageLink));
    closeModal();
  };

  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-main">
      {selectedFolder ? (
        <div>
          <Button ml={20} onClick={() => setSelectedFolder(null)}>Atpakaļ</Button>
          <h2 className="folder-modal-title">{selectedFolder}</h2>
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
                    className="preview-image"
                    onClick={() => handleImageClick(`http://localhost${file}`)}
                  />
                ))
              ) : (
                <p>Šajā mapē nav failu.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
        <div className="search-bar">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input 
            type="text" 
            placeholder="Meklēt mapes..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="folder-main">
          {isLoadingFolders ? (
            <>
            <Skeleton w={100} h={100}></Skeleton>
            <Skeleton w={100} h={100}></Skeleton>
            <Skeleton w={100} h={100}></Skeleton>
            <Skeleton w={100} h={100}></Skeleton>
            <Skeleton w={100} h={100}></Skeleton>
            </>
          ) : (
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
        </div>
      </>)}
    </div>
  );
}
