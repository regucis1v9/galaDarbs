import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faUpload, faPlus, faFile, faTv, faT } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Sidebar() {
    const [activeLink, setActiveLink] = useState(() => localStorage.getItem('activeComponent') || 'upload');

    const changeComponent = (component) => {
        setActiveLink(component);
        localStorage.setItem('activeComponent', component);
    };

    useEffect(() => {
        const savedComponent = localStorage.getItem('activeComponent') || 'upload';
        setActiveLink(savedComponent);
    }, []);

    return (
        <div className="sidebar">
            <Link
                to="/upload"
                className={`sidebar-button ${activeLink === 'upload' ? 'active-button' : ''}`}
                onClick={() => changeComponent('upload')}
            >
                <FontAwesomeIcon icon={faUpload} />
                Augšupielādēt failus
            </Link>

            {/* <Link
                to="/create"
                className={`sidebar-button ${activeLink === 'create' ? 'active-button' : ''}`}
                onClick={() => changeComponent('create')}
            >
                 <FontAwesomeIcon icon={faPlus} />
                Izveidot mapi
            </Link> */}

            <Link
                to="/view"
                className={`sidebar-button ${activeLink === 'view' ? 'active-button' : ''}`}
                onClick={() => changeComponent('view')}
            >
                <FontAwesomeIcon icon={faFile} />
                Skatīt failus
            </Link>

            <Link
                to="/selectScreen"
                className={`sidebar-button ${activeLink === 'manage' ? 'active-button' : ''}`}
                onClick={() => changeComponent('manage')}
            >
                <FontAwesomeIcon icon={faTv} />
                Menedžēt ekrānus
            </Link>
        </div>
    );
}
