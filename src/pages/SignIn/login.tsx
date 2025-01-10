import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/auth";
import { Link } from "react-router";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signIn } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn(email, password);
    return;
  };

  return (
    <div id="login-container">
      <h1>Login</h1>
      <form className="form-login" onSubmit={handleSubmit}>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-email"
          autoComplete="off"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="register" id="forgot-pass">
          Fazer Cadastro?
        </Link>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
