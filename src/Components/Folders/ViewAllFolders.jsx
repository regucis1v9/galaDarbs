import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';

export default function ViewFiles() {
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("http://localhost/api/listFolders")
      .then((response) => response.json())
      .then((data) => {
        setFolders(data.folders);
      })
      .catch((error) => {
        console.error("Error fetching folder list:", error);
      });
  }, []);

  useEffect(() => {
    dispatch(updateActiveComponent('view'));
  }, [dispatch]);

  const filteredFolders = folders.filter(folder => 
    folder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFolder = async () => {
    if (newFolderName.length === 0) {
        setError("Nosaukums nevar būt tukšs");
        return;
    }

    if (newFolderName.length > 255) {
        setError('Nosaukuma maksimālais garums ir 255 rakstzīmes');
        return;
    }

    setError(''); 
    try {
        const response = await fetch("http://localhost/api/createFolder", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ folder_name: newFolderName }),
        });

        if (!response.ok) {
            throw new Error('Failed to create folder');
        }

        const data = await response.json();
        setFolders((prevFolders) => [...prevFolders, data.folder]); // Use the returned folder name
        setShowPopup(false);
        setNewFolderName('');
    } catch (error) {
        console.error('Error creating folder:', error);
        setError('Radās kļūda izveidojot mapi'); // Display error message
    }
};

  const deleteFolder = async (folder) => {
    try {
      const response = await fetch("http://localhost/api/deleteFolder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folder }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      setFolders((prevFolders) => prevFolders.filter(f => f !== folder));
      setShowDeletePopup(false); // Close the popup after deletion
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleDeleteButtonClick = (folder) => {
    setFolderToDelete(folder);
    setShowDeletePopup(true);
  };

  return (
    <div className="manage-main">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Meklēt mapes..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button onClick={() => setShowPopup(true)}>Pievienot mapi</button>
      </div>

      {showPopup && (
        <div className="modal">
          <div className="popup">
            <h2>Ievadiet jaunās mapes nosaukumu:</h2>
            <input 
              className="new-folder-input"
              type="text" 
              value={newFolderName} 
              onChange={(e) => setNewFolderName(e.target.value)} 
              placeholder="Mapes nosaukums"
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="popup-buttons">
              <button onClick={handleAddFolder}>Izveidot</button>
              <button onClick={() => setShowPopup(false)}>Atcelt</button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="modal">
          <div className="popup">
            <h2>Vai tu tiešām vēlies dzēst "{folderToDelete}"?</h2>
            <p>Visi dati šajā tiks neatgriezeniski dzēsti.</p>
            <div className="popup-buttons">
              <button onClick={() => deleteFolder(folderToDelete)}>Jā, izdzēst</button>
              <button onClick={() => setShowDeletePopup(false)}>Atcelt</button>
            </div>
          </div>
        </div>
      )}

      <div className="folder-main">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder, index) => (
            <div key={index} className="folder-wrapper">
              <Link to={`/folderContent/${folder}`} title={folder}>
                <div className="folder-icon">
                  <FontAwesomeIcon className="black" icon={faFolder} />
                </div>
                <div className="folder-title">{folder}</div>
              </Link>
              <button className="red" onClick={(e) => {
                e.stopPropagation();
                handleDeleteButtonClick(folder);
              }}>
                <FontAwesomeIcon icon={faTrash} className="delete-icon" />
              </button>
            </div>
          ))
        ) : (
          <p>Nav pieejamu mapju.</p>
        )}
      </div>
    </div>
  );
}
