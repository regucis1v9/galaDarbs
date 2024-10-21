import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, Text } from '@mantine/core';
import { IconSearch, IconDeviceTv, IconMinus } from '@tabler/icons-react';
import classes from "../../style/SearchInput.module.css";

export default function ViewAllScreens() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [screens, setScreens] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [screenToDelete, setScreenToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        dispatch(updateActiveComponent('manage'));
        fetchScreens();
    }, [dispatch]);

    const fetchScreens = async () => {
        try {
            const response = await fetch('http://localhost/api/getAllScreens', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setScreens(data);
        } catch (error) {
            console.error('Error fetching screens:', error);
        }
    };

    const deleteScreen = async (id) => {
        try {
            const response = await fetch('http://localhost/api/deleteScreen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete screen');
            }

            setScreens((prevScreens) => prevScreens.filter(screen => screen.id !== id));
            setShowDeleteModal(false); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting screen:', error);
        }
    };

    const handleScreenClick = (id) => {
        navigate(`/dashboard/manageScreen/${id}`);
    };

    const handleDeleteButtonClick = (screen) => {
        setScreenToDelete(screen);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (screenToDelete) {
            deleteScreen(screenToDelete.id);
        }
    };

    const addScreen = async () => {
        try {
            const response = await fetch('http://localhost/api/addScreen', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add screen');
            }

            // Refetch screens after adding a new one
            fetchScreens();
        } catch (error) {
            console.error('Error adding screen:', error);
        }
    };

    const filteredScreens = screens.filter(screen =>
        screen.table_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-main">
            <div className="search-bar">
                <Input
                    placeholder='Ekrāna nosakums...'
                    classNames={{ wrapper: classes.maxWidth }}
                    leftSection={<IconSearch size={18} />}
                    size='md'
                    onChange={(e) => setSearchTerm(e.target.value)} // Added onChange for search functionality
                    variant='filled'
                />
                <Button onClick={addScreen} size='md'>Pievienot ekrānu</Button>
            </div>

            {filteredScreens.length > 0 ? (
                <div className="screen-links">
                    {filteredScreens.map((screen) => (
                        <div key={screen.id} className="screen-button">
                            <button className='red' onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteButtonClick(screen);
                            }}>
                                <IconMinus size={20} stroke={3} color='white' />
                            </button>
                            <IconDeviceTv size={100} />
                            <Text ta="center">{screen.table_name}</Text>
                        </div>
                    ))}
                </div>
            ) : (
                <Text className='screen-search-error'>Nevar atrast šādu ekānu.</Text>
            )}

            <Modal
                centered
                opened={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={`Dzēst "${screenToDelete?.table_name}"?`}
            >
                <Text>Ekrāns tiks izdzēsts mūžīgi.</Text>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button color="red" onClick={confirmDelete}>Jā, izdzēst</Button>
                    <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Atcelt</Button>
                </div>
            </Modal>
        </div>
    );
}
