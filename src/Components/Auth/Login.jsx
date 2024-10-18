import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
} from '@mantine/core';
import classes from '../../style/Login.module.css'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const submitLoginForm = async () => {
    let isValid = true;

    if (username.trim() === "") {
      setUsernameError("Lietotājvārds ir obligāts");
      isValid = false;
    } else {
      setUsernameError("");
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

    if (isValid) {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("http://localhost/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            password: password,
          }),
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);
        localStorage.setItem('token', data.token);
        if (response.ok) {
          navigate("/dashboard/upload");
        } else {
          if (data.errors) {
            setUsernameError(data.errors.name || "");
            setPasswordError(data.errors.password || "");
          }
          throw new Error(data.message || "Neizdevās pieslēgties");
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
        // Generic error message
        setUsernameError("Kaut kas nogāja greizi, mēģiniet vēlreiz.");
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLoginForm();
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to Mantine!
        </Title>

        <TextInput
          label="Lietotājvārds"
          placeholder="Tavs lietotājvārds"
          size="md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={usernameError}
        />
        <PasswordInput
          label="Parole"
          placeholder="Tava parole"
          mt="md"
          size="md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <Button
          fullWidth
          mt="xl"
          size="md"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Lūdzu, gaidiet..." : "Pieslēgties"}
        </Button>
      </Paper>
    </div>
  );
}
