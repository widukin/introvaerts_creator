import { useState } from 'react';
import Api from '../../shared/utils/api.js';
import { useTokenContext } from '../../shared/utils/context.js';
import { redirectAfterAuth } from '../../shared/utils/helpers';

import { SIGNUP } from '../../navigation/CONSTANTS';

// import { SignInContainer } from './Styles';
import Header from '../Header';
import Button from '../../shared/components/Button';
import SignForm from '../../shared/components/SignForm';
import LinkModule from '../../shared/components/LinkModule';
import SectionContainer from '../../shared/components/SectionContainer';

const Signin = props => {
  //getting token from context
  const { setToken } = useTokenContext();

  console.log('props: ', props);

  //for storing user credentials
  const [userLogIn, setUserLogIn] = useState({
    email: '',
    password: '',
    message: null,
  });

  //for reading input from login form
  const handleChange = e => {
    const { id, value } = e.target;
    setUserLogIn(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  //submitting login credentials & storing token
  const handleLogIn = async e => {
    e.preventDefault();
    const userPayload = {
      email: userLogIn.email,
      password: userLogIn.password,
    };

    const response = await Api.login(userPayload);

    if (response) {
      setToken(response.data.token ? true : false);

      if (response.data.token) {
        redirectAfterAuth(response.data.token, 'dashboard', props);
      }
    }
  };

  return (
    <>
      <Header />
      <SectionContainer width="20" margin="15% auto">
        <h1>Sign In</h1>
        <form method="POST" onSubmit={handleLogIn}>
          <SignForm
            htmlFor="email"
            label="email"
            type="email"
            id="email"
            name="email"
            value={userLogIn.email}
            handleChange={handleChange}
            required={true}
          />
          <SignForm
            htmlFor="password"
            label="password"
            type="password"
            id="password"
            name="password"
            value={userLogIn.password}
            handleChange={handleChange}
            required={false}
          />
          <Button type="submit" text="Submit" marginTop="5" />
        </form>
        <LinkModule text="sign up" marginTop="20" linkTo={SIGNUP} />
      </SectionContainer>
    </>
  );
};

export default Signin;
