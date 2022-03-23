/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { handleOpenFiles } from './utils/file-utils';

function App() {
  const [state, setState] = useState(Array);

  return (
    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
      <Button
        title="Select files"
        onPress={() => {
          handleOpenFiles()
            .then(data => setState(data))
            .catch(err => console.error(err));
        }}
      />
      {state.map(s => (
        <Text>{s.fileName}</Text>
      ))}
    </View>
  );
}

export default App;
/*
      <Button
        title="show save"
        onPress={() => {
          for (const s in state) {
            console.log(s);
            <Text style={{ fontSize: 100 }}>{s}</Text>;
          }
        }}
      />
      */
