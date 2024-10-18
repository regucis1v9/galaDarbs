import { useState } from "react";
import MantineInput from "../Mantine/MantineInput";
import { Button } from "@mantine/core";
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

  // Real-time validation for username
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value.trim() === "") {
      setUsernameError("Lietotājvārds ir obligāts");
    } else {
      setUsernameError("");
    }
  };

  // Real-time validation for email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim() === "") {
      setEmailError("E-pasts ir obligāts");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Neatbilstošs e-pasta formāts");
    } else {
      setEmailError("");
    }
  };

  // Real-time validation for password
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.trim() === "") {
      setPasswordError("Parole ir obligāta");
    } else if (value.length < 8) {
      setPasswordError("Parolei jābūt vismaz 8 rakstzīmēm");
    } else {
      setPasswordError("");
    }
  };

  // Real-time validation for role
  const handleRoleChange = (value) => {
    setRole(value);
    if (value.trim() === "") {
      setRoleError("Lūdzu izvēlieties pieejas līmeni");
    } else {
      setRoleError("");
    }
  };

  const submitForm = async () => {
    let isValid = true;

    // Checking if any field has an error before submission
    if (usernameError || emailError || passwordError || roleError) {
      isValid = false;
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
            label="Lietotājvārds"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Lietotājvārds"
            error={usernameError}
          />
        </span>
        <span>
          <MantineInput
            label="Epasts"
            value={email}
            onChange={handleEmailChange}
            placeholder="Epasts"
            error={emailError}
          />
        </span>
        <span>
          <MantineInput
            label="Parole"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Parole"
            error={passwordError}
          />
        </span>
        <span>
          <Select
            variant="filled"
            label="Pieejas līmenis"
            id="folderSelect"
            data={['Skatītājs', 'Rediģētājs', 'Administrators']}
            placeholder="Izvēlieties pieejas līmeni"
            value={role}
            onChange={handleRoleChange}
            classNames={dropdown}
            error={roleError}
          />
        </span>
        <span className="flex-column align-center">
          <Button size="md" type="submit">Izveidot lietotāju</Button>
          <p className={`user-success ${createdUser ? 'opacity-1' : ''}`}>
            Lietotājs pievienots veiksmīgi
          </p>
        </span>
      </form>
    </div>
  );
}
