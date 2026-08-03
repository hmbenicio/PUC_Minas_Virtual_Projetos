import React, { useState, Fragment, useCallback, useMemo } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { Calendar, CalendarUtils } from "react-native-calendars";
import calendarConfig from "../assets/calendarConfig";

const INITIAL_DATE = new Date().toISOString().split("T")[0];

const CalendarViewer = () => {
  const [selected, setSelected] = useState(INITIAL_DATE);

  const getDate = (count) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  const marked = useMemo(() => {
    return {
      [getDate(0)]: {
        dotColor: "#426E86",
        marked: true,
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: "#F0810F",
        selectedTextColor: "#F8F1E5",
      },
    };
  }, [selected]);

  const renderCalendar = () => {
    return (
      <>
        <Fragment>
          <Text style={styles.text}>Agendamento</Text>
          <Calendar
            calendarID={calendarConfig.calendars.FIRST}
            enableSwipeMonths
            current={INITIAL_DATE}
            style={styles.calendar}
            onDayPress={onDayPress}
            markedDates={marked}
            locale="pt-br"
            firstDay={0}
          />
        </Fragment>
      </>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      calendarID={calendarConfig.calendars.CONTAINER}
    >
      {renderCalendar()}
    </ScrollView>
  );
};

export default CalendarViewer;

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
    padding: 10,
    backgroundColor: "#F9BA32",
    fontSize: 18,
  },
});
