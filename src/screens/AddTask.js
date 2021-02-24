import React, { useLayoutEffect, useState } from 'react'
import {
  Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import commonStyles from '../commonStyles'

export default props => {
  const [initial, setInitial] = useState({ desc: '' })
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  useLayoutEffect(() => setShowDatePicker(false), [date])

  getDate = () => {
    let datePicker = (<DateTimePicker value={date} mode='date'
      onChange={(_, newDate) => setDate(newDate || date)} />)

    const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY')

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.date} >{dateString}</Text>
          </TouchableOpacity>
          {showDatePicker && datePicker}
        </View>
      )
    }
    return datePicker
  }

  save = () => {
    const newTask = {
      desc: initial.desc,
      date: date,
    }
    props.onSave && props.onSave(newTask)
    setInitial({ desc: '' })
    setDate(new Date())
    setShowDatePicker(false)
  }

  return (
    <Modal transparent={true} visible={props.isVisible}
      onRequestClose={props.onCancel} animationType='slide'>
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput style={styles.input} placeholder="Informe a descrição"
          value={initial.desc} onChangeText={desc => setInitial({ desc })} />
        {getDate()}
        <View style={styles.buttons} >
          <TouchableOpacity onPress={props.onCancel} >
            <Text style={styles.button} >Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save} >
            <Text style={styles.button} >Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background}></View>
      </TouchableWithoutFeedback>
    </Modal >
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  container: {
    backgroundColor: "#FFF"
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    textAlign: 'center',
    padding: 15,
    fontSize: 15,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    height: 40,
    margin: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    marginLeft: 15,
  }
})