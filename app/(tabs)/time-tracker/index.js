// 📦 React Native components used to build the layout
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
// ⚛️ React core hooks
import React, { useState, useEffect } from 'react';
// 🎨 Icon library from Expo
import TimerBar from '../../../components/time-tracker/TimerBar';
import EventBlock from '@/components/time-tracker/EventBlock';
import useTimer from '@/hooks/useTimer'; // ⬅️ new custom hook
import styles from '@/components/time-tracker/timeTrackerStyles';





// 🧠 This is the main screen shown when the user taps the "Calendar" tab
export default function CalendarScreen() {

    const {
        sessionName,
        setSessionName,
        elapsedTime,
        isPaused,
        isTracking,
        startTracking,
        pauseTracking,
        resumeTracking,
        stopTracking,
        eventBlocks,
        setEventBlocks,
    } = useTimer();

    const [modalVisible, setModalVisible] = useState(false); // shows or hides the event detail
    const [selectedEvent, setSelectedEvent] = useState(null); // which event was tapped

    // Get the current date
    const today = new Date();

    // Turn the date into a readable string like "Thursday, Apr 11"
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',   // Show day name (like "Thursday")
        month: 'short',    // Show month name shortened (like "Apr")
        day: 'numeric',    // Show the day of the month (like "11")
    });

    // Get the current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = today.getDay();

    // Find Monday of the current week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - ((currentDay + 6) % 7)); // Adjust to Monday

    // Create an array of 7 days starting from Monday
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i); // Move forward by i days
        return day;
    });




    return (
        // Main container for the screen
        <View style={styles.container}>

            {/* --- HEADER --- */}
            <View style={styles.topBar}>
                <Text style={styles.title}>Calendar</Text>
                <TouchableOpacity onPress={() => console.log('Settings tapped')}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* --- DATE ROW --- */}
            <View style={styles.dateRow}>
            // Show today’s date (automatically updates every day)
                <Text style={styles.dateText}>{formattedDate}</Text>
                <Text style={styles.timeText}>3:50:22</Text>
            </View>

            {/* --- WEEKDAYS --- */}
            <View style={styles.weekRow}>
                {weekDays.map((day, index) => {
                    const isToday =
                        day.toDateString() === today.toDateString(); // Check if this is today

                    return (
                        <View key={index} style={styles.weekDayColumn}>
                            {/* Day name: M T W T F S S */}
                            <Text style={styles.dayLetter}>
                                {day.toLocaleDateString('en-US', { weekday: 'narrow' })}
                            </Text>

                            {/* Date number, like 11 */}
                            <View style={isToday ? styles.selectedDate : null}>
                                <Text style={isToday ? styles.selectedDateText : styles.dateNumber}>
                                    {day.getDate()}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>


            {/* --- TIME GRID --- */}
            <ScrollView style={styles.timeGrid} contentContainerStyle={{ flexGrow: 1 }}>
                {Array.from({ length: 25 }, (_, index) => {
                    const hour = index === 24 ? '00' : index < 10 ? `0${index}` : `${index}`;

                    const eventsThisHour = eventBlocks.filter(event => {
                        const eventHour = new Date(event.start).getHours();
                        return eventHour === index;
                    });

                    return (
                        <View key={index} style={styles.timeSlot}>
                            <View style={styles.timeLabelContainer}>
                                <Text style={styles.timeLabel}>{hour}:00</Text>
                            </View>
                            <View style={styles.timeSlotContent}>
                                <View style={styles.hourLine} />
                                {eventsThisHour.map(event => (
                                    <EventBlock
                                        key={event.id}
                                        event={event}
                                        styles={styles}
                                        onPress={() => {
                                            setSelectedEvent(event);
                                            setModalVisible(true);
                                        }}
                                    />
                                ))}

                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <TimerBar
                isTracking={isTracking} // true if a session is running
                isPaused={isPaused} // true if the session is currently paused
                elapsedTime={elapsedTime} // how many seconds the session has been running
                sessionName={sessionName} // what the user typed as the session name
                onChangeSessionName={setSessionName} // updates the session name when typing
                onStart={startTracking} // starts a new session
                onPause={pauseTracking} // pauses the session
                onResume={resumeTracking} // resumes the session after pause
                onStop={stopTracking} // stops and saves the session
                styles={styles} // styles for layout and colors
            />



            {selectedEvent && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContent}>
                            {/* Editable title */}
                            <TextInput
                                style={styles.modalTitleInput}
                                value={selectedEvent.name}
                                onChangeText={(text) => {
                                    const updatedEvent = { ...selectedEvent, name: text };
                                    setSelectedEvent(updatedEvent);
                                    setEventBlocks(prev =>
                                        prev.map(e => (e.id === updatedEvent.id ? updatedEvent : e))
                                    );
                                }}
                            />

                            {/* Time info */}
                            <Text style={styles.modalLabel}>Start Time:</Text>
                            <Text style={styles.modalTime}>
                                {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>

                            <Text style={styles.modalLabel}>End Time:</Text>
                            <Text style={styles.modalTime}>
                                {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>

                            {/* Active & Rest time */}
                            <Text style={styles.modalLabel}>Active Time:</Text>
                            <Text style={styles.modalValue}>
                                {Math.floor((selectedEvent.active ?? 0) / 60)} min
                            </Text>

                            <Text style={styles.modalLabel}>Rest Time:</Text>
                            <Text style={styles.modalValue}>
                                {Math.floor((selectedEvent.rest ?? 0) / 60)} min
                            </Text>

                            {/* Close button */}
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    );

}
