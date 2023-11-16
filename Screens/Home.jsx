import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import uuid from 'react-native-uuid'
import Checkbox from 'expo-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Home = () => {

    const [todos, setTodos] = useState([])
    const [input, setInput] = useState("")

    useEffect(()=> {
        loadTodos()
    }, [])


    //AsyncStorage doesn't save most recent Todo without this useEffect block
    useEffect(()=> {

        saveTodos(todos)

    }, [todos])


    const addTodo = async () => {

        if(input.trim() === ''){
            return
        }

        const newTodo = { 
            id: uuid.v4(), 
            text: input, 
            completed: false 
        }

        setTodos([...todos, newTodo])

        await saveTodos([...todos, newTodo])

        setInput("")
    }

    const handleCompletion = async (index) => {
        const newTodos = [...todos]

        newTodos[index].completed = !newTodos[index].completed
        setTodos(newTodos)
        await saveTodos(newTodos)
    }

    const handleDelete = async (id) => {

        const newTodos = todos.filter(item => item.id !== id)
        setTodos(newTodos)
        await saveTodos(newTodos)
    }


    const saveTodos = async () => {

        try {
            
            const todosJSON = JSON.stringify(todos)
            await AsyncStorage.setItem('todos333', todosJSON)

        } catch (error) {
            console.log("ERROR saving todos to AsyncStorage: ", error)
        }

    }


    const loadTodos = async () => {

        try {
            const todosJSON = await AsyncStorage.getItem('todos333')

            if(todosJSON !== null){
                const savedTodos = JSON.parse(todosJSON)
                setTodos(savedTodos)
            }

        } catch (error) {
            console.log("ERROR getting todos from AsyncStorage: ", error)
        }

    }


  return (
    <View className="flex-1 pt-14">
        <View className="mx-4">
            <View>
                <Text className="text-2xl mb-4">Todos</Text>
            </View>

            <View className="flex-row items-center justify-center mb-4">
                <TextInput 
                    className="bg-white rounded-md w-3/4 p-2 text-xl"
                    placeholder="Todo..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity className="bg-white rounded-full p-3 ml-3" onPress={() => addTodo()}>
                    <Feather name="plus" size={24} color="gray" />
                </TouchableOpacity>
            </View>


            <FlatList 
                data={todos}
                renderItem={({ item, index })=> {
                    return (
                        <View className={`${item.completed ? 'bg-green-100' : 'bg-white'} flex-row items-center justify-between p-2 my-1 rounded-md`}>
                            <View className="flex-row items-center">
                                <Checkbox 
                                    className="w-7 h-7 mr-2"
                                    value={item.completed}
                                    onValueChange={()=> handleCompletion(index)}
                                    color={item.completed ? 'green' : null}
                                />
                                <Text className="text-lg">{item.text}</Text>
                            </View>
                            <Feather name="delete" size={24} color="darkred" onPress={()=> handleDelete(item.id)} />
                            
                        </View>
                    )
                }}
                keyExtractor={(item) => item.id}
            />
        </View>

        
    </View>
  )
}

export default Home