import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  Alert, FlatList, ImageBackground, SafeAreaView, StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'
import todayImage from '../../assets/imgs/today.jpg'

import Task from '../components/Task'
import AddTask from './AddTask'

const tasksI = [{
  id: Math.random(),
  desc: 'Comprar livro',
  estimateAt: new Date(),
  doneAt: new Date(),
}, {
  id: Math.random(),
  desc: 'Ler livro',
  estimateAt: new Date(),
  doneAt: null,
}]

export default () => {
  const [tasks, setTasks] = useState(tasksI)
  const [showDoneTasks, setShowDoneTasks] = useState(false)
  const [visibleTasks, setVisibleTasks] = useState(tasks)
  const [showAddTask, setShowAddTask] = useState(false)
  useLayoutEffect(() => filterTasks(), [tasks, showDoneTasks])
  useEffect(() => setShowAddTask(false), [tasks])

  const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

  toggleTask = taskId => {
    const newTasks = [...tasks]
    newTasks.forEach(task => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date()
      }
    })
    setTasks(newTasks)
  }

  toggleFilter = () => {
    setShowDoneTasks(!showDoneTasks)
  }

  filterTasks = () => {
    let newVisibleTasks = null
    if (showDoneTasks) {
      newVisibleTasks = [...tasks]
    } else {
      const pending = task => task.doneAt === null
      newVisibleTasks = tasks.filter(pending)
    }
    setVisibleTasks(newVisibleTasks)
  }

  addTask = newTask => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada!')
      return
    }
    const _tasks = [...tasks]
    _tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null,
    })
    setTasks(_tasks)
  }

  deleteTask = id => {
    const _tasks = tasks.filter(task => task.id !== id)
    setTasks(_tasks)
  }

  return (
    <SafeAreaView style={styles.container}>
      <AddTask isVisible={showAddTask}
        onCancel={() => setShowAddTask(false)} onSave={addTask} />
      <ImageBackground source={todayImage} style={styles.background}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={toggleFilter}>
            <Icon name={showDoneTasks ? 'eye' : 'eye-slash'}
              size={20} color={commonStyles.colors.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subtitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <FlatList data={visibleTasks} keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => <Task {...item} onToggleTask={toggleTask}
            onDelete={deleteTask} />} />
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.7}
        onPress={() => setShowAddTask(true)}>
        <Icon name='plus' size={20} color={commonStyles.colors.secondary} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: 10
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  }
})