import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSearch, faTrash, faX } from '@fortawesome/free-solid-svg-icons';

export default function ViewFolderContent() {
  const { folderName } = useParams();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteImages, setDeleteImages] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const token = localStorage.getItem('token')
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateActiveComponent('view'));
  }, [dispatch]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/api/retrieveFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Accept':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({ folder_name: folderName }),
      });

      if (!response.ok) {
        throw new Error('Error finding files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderName]);

  const extractFileName = (fileUrl) => {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  };

  const handleImageClick = (fileUrl) => {
    const fileName = extractFileName(fileUrl);

    if (!deleteImages) {
      setSelectedImage(fileUrl);
    } else {
      setImagesToDelete((prevImages) => {
        if (prevImages.includes(fileName)) {
          return prevImages.filter((image) => image !== fileName);
        } else {
          return [...prevImages, fileName];
        }
      });
    }
  };

  const deleteFiles = async () => {
    try {
      const response = await fetch('http://localhost/api/deleteFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Accept':'application/json', 'Authorization':`Bearer ${token}` },
        body: JSON.stringify({
          folder_name: folderName,
          files: imagesToDelete,
        }),
      });

      if (!response.ok) {
        throw new Error('Error deleting files');
      }

      // Update the state to remove deleted files
      setFiles((prevFiles) => 
        prevFiles.filter(file => !imagesToDelete.includes(extractFileName(file)))
      );

      alert('Files deleted successfully!');
    } catch (error) {
      alert('Error deleting files: ' + error.message);
    } finally {
      setDeleteImages(false);
      setImagesToDelete([]);
    }
  };

  const handleRedButton = () => {
    if (deleteImages) {
      if (imagesToDelete.length > 0) {
        deleteFiles();
      } else {
        setDeleteImages(false);
      }
    } else {
      setDeleteImages(true);
    }
  };
  

  const handleBlueButton = () => {
    if (deleteImages) {
      setDeleteImages(false);
      setImagesToDelete([]); 
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const filteredFiles = files.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-main">
      <div className="search-bar">
      <FontAwesomeIcon className="search-icon" icon={faSearch} />
        <input 
          type="text" 
          placeholder="Meklēt failus..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button className='search-buttons' id="red" onClick={handleRedButton}>
          {deleteImages ? "Apstiprināt dzēšanu" : "Dzēst attēlus"}
        </button>
        <button className='search-buttons' onClick={handleBlueButton}>
          {deleteImages ? "Atcelt dzēšanu" : "Pievienot attēlus mapei"}
        </button>
      </div>
    
      {filteredFiles.length > 0 ? (
        <div className='image-previews'>
          {filteredFiles.map((file) => (
            <img 
              key={extractFileName(file)} 
              src={`http://localhost${file}`}  
              alt={`File ${extractFileName(file)}`} 
              className={`preview-image ${deleteImages && imagesToDelete.includes(extractFileName(file)) ? 'clicked-image' : ''}`} 
              onClick={() => handleImageClick(file)} 
            />
          ))}
        </div>
      ) : (
        <div className='search-error'>{searchTerm ? "Nevar atrast failu ar tādu nosaukumu" : "Šī mape ir tukša"}</div>
      )}

      {selectedImage && !deleteImages && (
        <div className='modal' onClick={handleCloseModal}>
          <img src={`http://localhost${selectedImage}`}   alt="Full size" className='modal-image' />
        </div>
      )}
    </div>
  );
}
