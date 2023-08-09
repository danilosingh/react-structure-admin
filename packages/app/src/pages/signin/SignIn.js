/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuthContext, configManager } from 'react-structure-admin';

const SignIn = () => {
  console.log("SignIn");
  console.log(useAuthContext());
  const { isAuthenticated, login, user } = useAuthContext();
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [inputPassword, setInputPassword] = useState('');
  const handleInputChange = (e) => {
    if (e.target.value) {
      e.target.classList.add('filled');
    } else {
      e.target.classList.remove('filled');
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      email: e.target.email.value,
      password: e.target.password.value
    });
  };
  console.log(isAuthenticated);
  const redirectAuthenticatedtUser = () => {
    const { roles = [] } = configManager.getConfig();
    const role =
      roles.find((c) => c.name === user.role) ||
      roles.find((c) => c.name === `*`);

    if (role && role.defaultPath) {
      return <Redirect to={role.defaultPath} />;
    }

    return <Redirect to="/pxxx" />;
  };

  if (isAuthenticated) {
    return redirectAuthenticatedtUser();
  }
  const handleShowPassword = () => {
    if (visiblePassword) {
      setVisiblePassword(false);
      document.getElementById('input-password').type = 'text';
    } else {
      setVisiblePassword(true);
      document.getElementById('input-password').type = 'password';
    }
  };

  return (
    <>
      <div className="container-login">
        <form className="form-login" onSubmit={handleSubmit}>
          <h1>Entrar</h1>
          <p className="gx-mb-5">Informe suas credenciais para entrar.</p>
          <fieldset>
            <div className="fieldCont">
              <input
                required="required"
                type="email"
                name="email"
                onChange={handleInputChange}
              />
              <label className="over">Seu endereço de e-mail</label>
            </div>
            <div className="fieldCont last">
              <input
                autoComplete="off"
                required="required"
                type="password"
                name="password"
                id="input-password"
                onChange={(e) => setInputPassword(e.target.value)}
              />
              <label className="over">Sua senha</label>              
            </div>
          </fieldset>
          <div className="forgot-password">
            <a href="forgot-password">Esqueceu sua senha?</a>
          </div>
          <button className="btn-in gx-mt-3" type="submit">
            Acessar
          </button>
          <div className="gx-mt-2">
            <span>Ainda não possui conta?</span>
            <a href="signup">Crie sua conta</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
