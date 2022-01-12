import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import fast_xml from 'fast-xml-parser';
import {xml_js_options} from './xml_config';
import {ST, ST_Ink} from './starter';

const textAreaStyles = StyleSheet.create({
  input: {
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
  },
});

const Inputter: React.FC<{
  str: string;
  onValueChange: (arg: string) => void;
}> = ({str, onValueChange}) => {
  return (
    <TextInput
      style={textAreaStyles.input}
      placeholder={str}
      onChangeText={onValueChange}
      multiline
      defaultValue={''}
      numberOfLines={10}
    />
  );
};

const Printer: React.FC<{
  title: string;
  str: string;
}> = ({title, str}) => {
  return (
    <View style={textAreaStyles.input}>
      <Text style={textAreaStyles.sectionTitle}>{title}</Text>
      <Text>{str}</Text>
    </View>
  );
};

export const Column: React.FC = ({}) => {
  const [inkObj, setInkObj] = useState<ST_Ink>();
  const [chan, setChan] = useState('');
  const [iddb, setIddb] = useState('');
  const [sumX, setSumX] = useState(0.0);

  const renderXML = (ink: string) => {
    const r = fast_xml.parse(ink, xml_js_options) as ST;
    setInkObj(r.ink);
    if (inkObj !== undefined) {
      renderChannels(inkObj);
      renderIddb(inkObj);
    }
  };

  const renderChannels = (ink: ST_Ink) => {
    const r = ink.traceFormat.channel
      .map(u => u.attr.name + ' ' + u.attr.type)
      .reduce((acc, e) => acc + '\n' + e);
    setChan(r);
  };

  const renderIddb = (ink: ST_Ink) => {
    const r =
      ink.annotation.find(e => e.attr.type === 'iddb')?.['#text'] ??
      'value not found!';
    setIddb(r);
  };

  return (
    <View style={{}}>
      <Inputter str={'input here...'} onValueChange={ink => renderXML(ink)} />
      <Printer title={'Channels'} str={chan} />
      <Printer title={'iddb'} str={iddb} />
      <Printer title={'Raw values'} str={JSON.stringify(inkObj)} />
    </View>
  );
};
