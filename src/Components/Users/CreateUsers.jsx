import { useState } from "react";
import MantineInput from "../Mantine/MantineInput";
import dropdown from "../../style/ContainedInput.module.css";
import { Select } from "@mantine/core";

export default function CreateUsers() {
  const token = localStorage.getItem('token');
  const [createdUser, setCreatedUser] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // New state for role

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState(""); // New error state for role

  const submitForm = async () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("Lietotājvārds ir obligāts");
      isValid = false;
    } else {
      setUsernameError("");
    }
    if (email.trim() === "") {
      setEmailError("E-pasts ir obligāts");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Neatbilstošs e-pasta formāts");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Parole ir obligāta");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Parolei jābūt vismaz 8 rakstzīmēm");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (role.trim() === "") {
      setRoleError("Lūdzu izvēlieties pieejas līmeni");
      isValid = false;
    } else {
      setRoleError("");
    }

    if (isValid) {
      try {
        const response = await fetch("http://localhost/api/createUser", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: username,
            password: password,
            email: email,
            role: role
          }),
        });
        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setEmailError('');
          setUsernameError('');
          setPasswordError('');
          setRoleError('');
          setCreatedUser(true);
        } else {
          if (data.errors) {
            setCreatedUser(false);
            setUsernameError(data.errors.name || '');
            setEmailError(data.errors.email || '');
            setPasswordError(data.errors.password || '');
            setRoleError(data.errors.role || ''); 
          }
          throw new Error(data.message || 'Neizdevās izveidot lietotāju');
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div className="create-user-content">
      Izveidot lietotāju
      <form className="create-container" onSubmit={handleSubmit}>
        <span>
          <MantineInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <p className={`input-error ${usernameError ? "active-error" : ""}`}>
            {usernameError}
          </p>
        </span>
        <span>
          <MantineInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <p className={`input-error ${emailError ? "active-error" : ""}`}>
            {emailError}
          </p>
        </span>
        <span>
          <MantineInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <p className={`input-error ${passwordError ? "active-error" : ""}`}>
            {passwordError}
          </p>
        </span>
        <span>
          <Select
            label="Pieejas līmenis"
            id="folderSelect"
            data={['Skatītājs', 'Rediģētājs', 'Administrators']}
            placeholder="Izvēlieties pieejas līmeni"
            value={role}
            onChange={setRole} 
            classNames={dropdown}
          />
          <p className={`input-error ${roleError ? "active-error" : ""}`}>
            {roleError}
          </p>
        </span>
        <span className="flex-column align-center">
          <button type="submit" className="create-user-button">
            Izveidot lietotāju
          </button>
          <p className={`user-success ${createdUser ? 'opacity-1' : ''}`}>
            Lietotājs pievienots veiksmīgi
          </p>
        </span>
      </form>
    </div>
  );
}
