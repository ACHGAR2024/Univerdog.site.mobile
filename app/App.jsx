import React from 'react';
import { UserProvider } from './context/UserContext';
import AppointmentsManagerUser from './screens/AppointmentsManagerUser';

const App = () => {
  return (
    <UserProvider>
      <AppointmentsManagerUser />
    </UserProvider>
  );
};

export default App;