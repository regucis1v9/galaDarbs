import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
                localStorage.setItem('token', data.token)
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
        <div className="login-main">
            <form className="login-container" onSubmit={handleSubmit}>
                <div className="login-image">
                    <img src="logo.jpg" alt="" />
                </div>
                <div className="login-inputs">
                    <span>
                        <input
                            className="create-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Lietotājvārds"
                        />
                        <p className={`input-error ${usernameError ? "active-error" : ""}`}>
                            {usernameError}
                        </p>
                    </span>
                    <span>
                        <input
                            className="create-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Parole"
                        />
                        <p className={`input-error ${passwordError ? "active-error" : ""}`}>
                            {passwordError}
                        </p>
                    </span>
                    <span>
                        <button type="submit" className="create-user-button" disabled={isLoading}>
                            {isLoading ? "Lūdzu, gaidiet..." : "Pieslēgties"}
                        </button>
                    </span>
                </div>
            </form>
        </div>
    );
}
