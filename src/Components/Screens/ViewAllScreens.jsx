import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateActiveComponent } from '../../actions/componentAction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export default function ViewAllScreens() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [screens, setScreens] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [screenToDelete, setScreenToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(updateActiveComponent('manage'));
        fetchScreens();
    }, [dispatch]);

    const fetchScreens = async () => {
        try {
            const response = await fetch('http://localhost/api/getAllScreens');
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
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete screen');
            }

            setScreens((prevScreens) => prevScreens.filter(screen => screen.id !== id));
            setShowPopup(false); // Close the popup after deletion
        } catch (error) {
            console.error('Error deleting screen:', error);
        }
    };

    const handleScreenClick = (id) => {
        navigate(`/manageScreen/${id}`);
    };

    const handleDeleteButtonClick = (screen) => {
        setScreenToDelete(screen);
        setShowPopup(true);
    };

    const confirmDelete = () => {
        if (screenToDelete) {
            deleteScreen(screenToDelete.id);
        }
    };

    const addScreen = async () => {
        try {
            const response = await fetch('http://localhost/api/addScreen', {
                method: 'GET', // Use GET request
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
                <input 
                    type="text" 
                    placeholder="Meklēt ekrānu..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button onClick={addScreen}>Pievienot ekrānu</button>
            </div>

            {filteredScreens.length > 0 ? (
                <div className="screen-links">
                    {filteredScreens.map((screen) => (
                        <div key={screen.id} className="screen-button" onClick={() => handleScreenClick(screen.id)}>
                            <button className='red' onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the onClick of the parent div
                                handleDeleteButtonClick(screen);
                            }}>
                                <FontAwesomeIcon className="delete-icon" icon={faTrash} />
                            </button>
                            <FontAwesomeIcon className="button-icon" icon={faTv} />
                            <div className="button-title">{screen.table_name}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='screen-search-error'>Nav pieejami ekrāni.</p>
            )}

            {showPopup && (
                <div className="modal">
                    <div className="popup">
                        <h2>Vai tu tiešām vēlies dzēst "{screenToDelete?.table_name}"?</h2>
                        <p>Visi dati saistīti ar šo ekrānu tiks dzēsti.</p>
                        <div className="popup-buttons">
                            <button onClick={confirmDelete}>Jā, izdzēst</button>
                            <button onClick={() => setShowPopup(false)}>Atcelt</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
