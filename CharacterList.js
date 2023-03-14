import React from "react";
import { FlatList, Text } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { useQuery, gql } from "@apollo/client";
import client from "./client";

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

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error :</Text>;

  console.log(data);

  return (
    <FlatList
      data={data.characters.results}      
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
            <Avatar source={{ uri: item.image }} size="large" />
          <ListItem.Subtitle>{item.species}</ListItem.Subtitle>
        </ListItem.Content>
        </ListItem>
      )}
    />
  );
}

export default CharacterList;
