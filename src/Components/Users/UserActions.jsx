import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function UserActions() {


    return (
        <div className="user-content">
            <Link to="/dashboard/createUser" className="user-actions">
                <FontAwesomeIcon className="" icon={faPlus}/>
                Izveidot lietotāju
            </Link>
            <Link to="/dashboard/viewAllUsers" className="user-actions">
                <FontAwesomeIcon className="" icon={faPenToSquare}/>
                Pārskatīt lietotājus
            </Link>
        </div>
    );
  }
  
  