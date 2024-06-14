import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VideoCard, EmptyState, InfoBox } from '../components'

import { getUserPosts, logOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

import { icons } from '../../constants'

import { router } from 'expo-router'

const Profile = () => {

  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  
  const { data: posts } = useAppwrite(() => 
    getUserPosts(user.$id)
  );


  const logout = async () => {
    await logOut();
    setUser(null)
    setIsLoggedIn(false)

    router.replace('/login')
  }
  
  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard 
            video={item}
          />

        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image 
                source={icons.logout}
                resizemode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-blue-200 rounded-lg flex justify-center items-center">
              <Image 
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode='cover'
              />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyles='mt-5'
              titleStyles="text-lg"
            />
            <View className="mt-5 flex flex-row">
            <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
            
            </View>
          </View>

        )}
      
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
       
      />
    </SafeAreaView>
  )
}

export default Profile