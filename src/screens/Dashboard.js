import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Pressable,
  Button,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,

} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import notifee, {AndroidImportance} from '@notifee/react-native';

export default function Dashboard() {
  const [count, setCount] = useState(0);
  const navigation = useNavigation();
  const [isCount, setIsCount] = useState('');
  const [post, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);

  const handleInc = useCallback(() => {
    setIsCount('inc');
    setCount(prevCount => prevCount + 1);
  }, []);

  const handleDec = useCallback(() => {
    setIsCount('dec');
    setCount(prevCount => prevCount - 1);
  }, []);

  //Used for local notification
  const createNotificationChannel = async () => {
    try {
      await notifee.createChannel({
        id: 'fetch-notification',
        name: 'Fetch Notifications',
        importance: AndroidImportance.HIGH,
      });
    } catch (error) {
      console.log('Notification Channel Error:', error);
    }
  };


  const HandleData = async () => {
    setIsLoading(true);

    try {
      if (!dataFetched) {
        await notifee.displayNotification({
          title: 'Fetching Data...',
          body: 'Please wait while data is being retrieved.',
          android: {
            channelId: 'fetch-notification',
            importance: AndroidImportance.HIGH,
          },
        });
      }

      console.log('Fetching data...');
      let response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
      );

      let data = await response.json();
      console.log('Fetched Data:', data);
      setPost(prevPost => [...prevPost, ...data]);
      setPage(prevPage => prevPage + 1);
      setDataFetched(true);

      if (!dataFetched) {
        await notifee.displayNotification({
          title: 'Fetching Data Complete!',
          body: `Fetched ${data.length} new posts.`,
          android: {
            channelId: 'fetch-notification',
            importance: AndroidImportance.HIGH,
          },
        });
      }
    } catch (error) {
      console.log('Fetch Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      HandleData();
      createNotificationChannel();
    }
  }, [dataFetched]);


  
  const renderItem = useCallback(
    ({item}) => {
      let {title, body, id} = item || {};
      return (
        <Pressable
          style={styles.PostContainer}
          onPress={() => {
            navigation.navigate('PostDetails', {id});
          }}>
          <Text style={styles.PostTitle}>
            {id}. {title}
          </Text>
          <Text style={styles.PostBody}>{body}</Text>
        </Pressable>
      );
    },
    [navigation],
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />

      <View style={styles.PostBody}>
        <FlatList
          data={post}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{marginBottom: 20}}>
              <View style={styles.row}>
                <View
                  style={[{borderWidth: 1, borderColor: '#ccc'}, styles.row]}>
                  <Text
                    style={[
                      styles.CountBtn,
                      {
                        backgroundColor:
                          isCount === 'dec' ? 'lightblue' : '#ccc',
                      },
                    ]}
                    onPress={() => {
                      if (count > 0) {
                        handleDec();
                      }
                    }}>
                    <AntDesign
                      name="minus"
                      size={20}
                      color={isCount === 'dec' ? 'white' : 'black'}
                    />
                  </Text>
                  <Text
                    style={[
                      styles.CountBtn,
                      {borderWidth: 0, fontSize: 15, fontWeight: '700'},
                    ]}>
                    {count}
                  </Text>
                  <Text
                    style={[
                      styles.CountBtn,
                      {
                        backgroundColor:
                          isCount === 'inc' ? 'lightblue' : '#ccc',
                      },
                    ]}
                    onPress={handleInc}>
                    <AntDesign
                      name="plus"
                      size={20}
                      color={isCount === 'inc' ? 'white' : 'black'}
                    />
                  </Text>
                </View>
              </View>
              <View style={styles.seprator} />
            </View>
          }
          keyExtractor={(item, index) => index.toString()}
          onEndReached={HandleData}
          onEndReachedThreshold={0.1}
        />
      </View>
      <View>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={styles.loadingText}>Loading more data...</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  CountBtn: {
    borderWidth: 0.2,
    borderColor: '#ccc',
    width: 40,
    textAlign: 'center',
    height: 30,
    paddingTop: 5,
  },
  seprator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  PostContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 4,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  PostBody: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  PostTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginBottom: 4,
  },
  PostBody: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    textAlign: 'left',
  },
  noDara: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    padding: 20,
  },
  loaderContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 5,
    fontSize: 14,
    color: 'gray',
  },
  PostBody: {
    flex: 9,
  },
});
