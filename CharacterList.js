import React from 'react';
import { FlatList } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useQuery, gql } from '@apollo/client';
import client from './client';

const GET_CHARACTERS = gql`
  query {
    characters {
      results {
        id
        name
        species
        image
      }
    }
  }
`;

function CharacterList() {
  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <FlatList
      data={data.characters.results}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem bottomDivider>          
          <ListItem.Content>
          <ListItem.Title style="bold">{item.name}</ListItem.Title>
            <Avatar source={{ uri: item.image }} size ="large" title={item.name} />
            <ListItem.Subtitle>{item.species}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      )}
    />
  );
}

export default CharacterList;
