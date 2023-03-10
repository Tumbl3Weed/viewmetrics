import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import CharacterList from './CharacterList';

function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <CharacterList />
      </SafeAreaView>
    </>
  );
}

export default App;
