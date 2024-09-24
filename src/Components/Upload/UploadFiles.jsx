import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
export default function UploadFiles() {
  const [dragging, setDragging] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost/api/listFolders');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFolders(Array.isArray(data.folders) ? data.folders : []);
      } catch (error) {
        console.error('Error fetching folders:', error);
        setFolders([]);
      }
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    dispatch(updateActiveComponent('upload'));
  }, []);


  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (newFiles) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      const imagePreviews = updatedFiles.map(file => 
        file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      ).filter(preview => preview !== null);

      previews.forEach(preview => URL.revokeObjectURL(preview));
      setPreviews(imagePreviews);

      console.log('Files array:', updatedFiles); 
      return updatedFiles;
    });
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    handleFiles(selectedFiles);
  };

  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.value);
  };

  const handleImageClick = (preview) => {
    setSelectedImage(preview);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleFileUpload = async () => {
    if (!selectedFolder || files.length === 0) {
      alert('Pirms augšupielādēšanas ir jāizvēlas mape un faili.');
      return;
    }

    const formData = new FormData();
    formData.append('folder_name', selectedFolder);

    files.forEach((file, index) => {
      formData.append(`files[]`, file);
    });
    try {
      const response = await fetch('http://localhost/api/uploadFiles', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      alert('Faili veiksmīgi auģsupielādēti');
      
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Neizdevās auģsupielādēt failus');
    }
  };

  return (
    <div className='width100'>
      {!selectedFolder ? (
        <div className='folder-selector-wrapper'>
          <label htmlFor="folderSelect">Izvēlies mapi, lai turpinātu</label>
          <select
            id="folderSelect"
            value={selectedFolder}
            onChange={handleFolderChange}
            className='dropdown-selector'
          >
            <option disabled hidden value="">Mape nav izvēlēta</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <div
            className={`dropzone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <p>Ievelc failus vai uzklikšķini, lai augšupielādētu failus "{selectedFolder}" mapē.</p>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              multiple
            />
          </div>
          <div className="submit-wrapper">
            <button className='submit-button' onClick={handleFileUpload}>Augšupielādēt</button>
          </div>
          <div className='image-previews'>
            {previews.map((preview, index) => (
              <img 
                key={index} 
                src={preview} 
                alt={`Preview ${index}`} 
                className='preview-image' 
                onClick={() => handleImageClick(preview)}
              />
            ))}
          </div>
          {selectedImage && (
            <div className='modal' onClick={handleCloseModal}>
              <img src={selectedImage} alt="Full size" className='modal-image' />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
