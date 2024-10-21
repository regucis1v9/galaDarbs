import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import { IconSearch, IconMinus, IconFolderFilled } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { Button, Input, useMantineTheme, Modal, Group, Text, useMantineColorScheme } from '@mantine/core';
import classes from "../../style/SearchInput.module.css";

export default function ViewFiles() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is active
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ folder_name: newFolderName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      const data = await response.json();
      setFolders((prevFolders) => [...prevFolders, data.folder]); // Use the returned folder name
      setShowAddFolderModal(false);
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ folder_name: folder }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      setFolders((prevFolders) => prevFolders.filter(f => f !== folder));
      setShowDeleteFolderModal(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleDeleteButtonClick = (folder) => {
    setFolderToDelete(folder);
    setShowDeleteFolderModal(true);
  };

  return (
    <div className="manage-main">
      <div className="search-bar">
        <Input 
        placeholder='Mapes nosakums...'
        classNames={{ wrapper: classes.maxWidth }} 
        leftSection={<IconSearch size={18} />} 
        size='md' 
        variant="filled"
        value={searchTerm} // Bind value to searchTerm
        onChange={(e) => setSearchTerm(e.currentTarget.value)}  />
        <Button onClick={() => setShowAddFolderModal(true)} size='md'>Pievienot mapi</Button>
      </div>
      <Modal
        opened={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        title="Ievadiet mapes nosaukumu:"
        centered
      >
        <Text size="sm" fw={500} mb={3}>
          Mapes nosaukums
        </Text>
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Mapes nosaukums"
          variant="filled"
        />
        {error && <Text color="red">{error}</Text>}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleAddFolder}>Izveidot</Button>
          <Button variant="outline" onClick={() => setShowAddFolderModal(false)}>Atcelt</Button>
        </div>
      </Modal>

      {/* Delete Folder Modal */}
      <Modal
        opened={showDeleteFolderModal}
        onClose={() => setShowDeleteFolderModal(false)}
        title={`Dzēst "${folderToDelete}"?`}
        centered
      >
        <Text>Mape tiks izdzēsta mūžīgi.</Text>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Button color="red" onClick={() => deleteFolder(folderToDelete)}>Jā, izdzēst</Button>
            <Button variant="outline" onClick={() => setShowDeleteFolderModal(false)}>Atcelt</Button>
          </div>
      </Modal>

      <div className="folder-main">
        {filteredFolders.length > 0 ? (
          filteredFolders.map((folder, index) => (
            <div key={index} className="screen-button">
              <Link to={`/dashboard/folderContent/${folder}`} title={folder}>
                <div className="folder-icon">
                  <IconFolderFilled size={60} color={isDarkMode ? theme.colors.blue[8] : theme.colors.blue[6]} />
                </div>
                <Text ta="center" color={isDarkMode ? "white" : "black"}>{folder}</Text>
              </Link>
              <button className="red" onClick={(e) => {
                e.stopPropagation();
                handleDeleteButtonClick(folder);
              }}>
                <IconMinus size={20} stroke={3} color='white' />
              </button>
            </div>
          ))
        ) : (
          <Text className="search-error">Nevar atrast šādu mapi.</Text>
        )}
      </div>
    </div>
  );
}
