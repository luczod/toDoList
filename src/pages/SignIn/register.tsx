import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/auth";
import { Link } from "react-router";
import { handlerToast } from "../../hooks/msg";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [username, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirm] = useState<string>("");

  const { registerIn } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      handlerToast("Preencha todos os campos!", "error");
      return;
    }
    registerIn(username, email, password, confirmpassword);

    return;
  };

  return (
    <div id="register-container">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Nome</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Digite seu nome"
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
        />
        <small></small>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Digite seu e-email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Digite sua senha"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password">Confirmar Senha</label>
        <input
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          placeholder="Confirme sua senha"
          onChange={(e) => setConfirm(e.target.value)}
        />
        <input type="submit" value="Cadastrar" />
        <Link to="/">Voltar</Link>
      </form>
    </div>
  );
}
