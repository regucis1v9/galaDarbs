import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { Select } from '@mantine/core';
import UploadButton from '../Mantine/UploadButton';
import DropzoneArea from '../Mantine/Dropzone';
import dropdown from '../../style/ContainedInput.module.css';

export default function UploadFiles() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]); // State to hold uploaded files
  const [previews, setPreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost/api/listFolders', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
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
  }, [token]);

  useEffect(() => {
    dispatch(updateActiveComponent('upload'));
  }, [dispatch]);

  const handleFolderChange = (value) => {
    setSelectedFolder(value);
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

    files.forEach((file) => {
      const trimmedFileName = file.name.replace(/\s+/g, '_');
      const trimmedFile = new File([file], trimmedFileName, { type: file.type });
      formData.append(`files[]`, trimmedFile);
    });

    try {
      const response = await fetch('http://localhost/api/uploadFiles', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      alert('Faili veiksmīgi augšupielādēti');

      setFiles([]); // Clear files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Neizdevās augšupielādēt failus');
    }
  };

  return (
    <div className='width100'>
      {!selectedFolder ? (
        <div className='folder-selector-wrapper'>
          <Select
            label="Izvēlies mapi, lai turpinātu"
            id="folderSelect"
            value={selectedFolder}
            onChange={handleFolderChange}
            data={folders.map(folder => ({ value: folder, label: folder }))}
            placeholder="Mape nav izvēlēta"
            classNames={dropdown}
            variant='filled'
          />
        </div>
      ) : (
        <div>
          <DropzoneArea files={files} setFiles={setFiles} /> 
          <div className="submit-wrapper">
            <UploadButton onUpload={handleFileUpload} />
          </div>
          <div className='image-previews'>
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className='preview-image'
                onClick={() => handleImageClick(URL.createObjectURL(file))}
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
