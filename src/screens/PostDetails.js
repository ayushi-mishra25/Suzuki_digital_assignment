import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function PostDetails() {
  const route = useRoute();
  const navigation = useNavigation()
  const {id} = route?.params;
  const [PostDetails, setPostDetails] = useState({});

  const fetchPostById = async () => {
    try {
      let response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();
      console.log('Fetched Post Data:', data);
      setPostDetails(data);
      setPost(data); // Assuming `setPost` updates state
    } catch (error) {
      console.log('Fetch Error:', error.message);
    }
  };

  useEffect(() => {
    fetchPostById();
  }, []);
  const {title, body} = PostDetails;
  return (
    <View style={styles.container}>

       <View style={[styles.row,styles.screenWidth]}>
        <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <AntDesign name="left" size={20} color={'black'} />
        </TouchableOpacity>
          <Text style={styles.PostTitle}>Detail</Text>
          <Text />
        </View>
        <View style={styles.seperator}/>
      <View style={styles.screenWidth}>
       
        <Text style={styles.PostTitle}>ID: {id}</Text>
        <Text style={styles.PostTitle}>Title: {title}</Text>
        <Text style={styles.PostBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  PostBody: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  PostTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    marginBottom: 10,
  },
  PostBody: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
    textAlign: 'left',
  },
  screenWidth: {
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
  },
  seperator:{
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    paddingVertical:10,
    marginBottom:20
  }
});
