// 📦 React Native components used to build the layout
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
// ⚛️ React core hooks
import React, { useState, useEffect } from 'react';
// 🎨 Icon library from Expo
import { Ionicons } from '@expo/vector-icons';



// 🧠 This is the main screen shown when the user taps the "Calendar" tab
export default function CalendarScreen() {

    // --- TIMER STATE ---

    // The task name typed into the timer input
    const [sessionName, setSessionName] = useState('');

    // When the current session was started
    const [startTime, setStartTime] = useState(null);

    // How many seconds the timer has been running (actively)
    const [elapsedTime, setElapsedTime] = useState(0);

    // Stores the number of seconds before the last pause (so we can resume)
    const [savedElapsed, setSavedElapsed] = useState(0);

    // Is the timer currently running or paused?
    const [isPaused, setIsPaused] = useState(false);

    // Used to determine if the timer is currently active
    const isTracking = startTime !== null;

    // When the user paused the timer (to calculate rest time later)
    const [pauseStartTime, setPauseStartTime] = useState(null);

    // Total time paused (used to calculate rest vs active)
    const [totalPausedTime, setTotalPausedTime] = useState(0);

    // Automatically name untitled sessions ("Session 1", "Session 2", etc.)
    const [sessionCount, setSessionCount] = useState(1);

    // --- EVENT LIST STATE ---

    // Stores all completed session blocks
    const [eventBlocks, setEventBlocks] = useState([]);

    // --- UI STATE ---

    // Modal (if used — may be removed later)
    const [modalVisible, setModalVisible] = useState(false);

    // The event currently selected (when user taps a block)
    const [selectedEvent, setSelectedEvent] = useState(null);

    // --- TIMER CONTROLS ---

    // Start the timer (from zero or resume)
    const startTracking = () => {
        const name = sessionName.trim();
        const finalName = name !== '' ? name : `Session ${sessionCount}`;

        setSessionName(finalName);
        setStartTime(new Date());
        setElapsedTime(0);
        setSavedElapsed(0);
        setIsPaused(false);

        if (name === '') {
            setSessionCount(prev => prev + 1);
        }
    };

    // Pause the timer
    const pauseTracking = () => {
        setIsPaused(true);
        setSavedElapsed(elapsedTime); // Save current time
        setPauseStartTime(new Date()); // Mark when paused
    };

    // Resume the timer from pause
    const resumeTracking = () => {
        if (pauseStartTime) {
            const now = new Date();
            const pausedDuration = (now.getTime() - pauseStartTime.getTime()) / 1000;
            setTotalPausedTime(prev => prev + pausedDuration);
        }

        setStartTime(new Date());
        setIsPaused(false);
        setPauseStartTime(null);
    };

    // Stop the timer and save the session as an event block
    const stopTracking = () => {
        if (startTime) {
            const endTime = new Date();
            const durationSeconds = elapsedTime;

            const newBlock = {
                id: Date.now(),            // unique id
                name: sessionName,
                start: startTime,
                end: endTime,
                duration: durationSeconds,
                rest: Math.floor(totalPausedTime),
                active: durationSeconds - Math.floor(totalPausedTime),
            };

            setEventBlocks([...eventBlocks, newBlock]);
        }

        // Reset timer state
        setStartTime(null);
        setElapsedTime(0);
        setSessionName('');
        setIsPaused(false);
        setSavedElapsed(0);
        setTotalPausedTime(0);
        setPauseStartTime(null);
    };

    // Update the timer every second
    useEffect(() => {
        let interval;

        if (startTime && !isPaused) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setElapsedTime(savedElapsed + diff); // Add saved time before the pause
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [startTime, isPaused, savedElapsed]);

    // Converts seconds to "X min Y sec" format
    const formatSeconds = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins} min ${secs} sec`;
    };



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
                <Text style={styles.dateText}>Tuesday, Sep 15</Text>
                <Text style={styles.timeText}>3:50:22</Text>
            </View>

            {/* --- WEEKDAYS --- */}
            <View style={styles.weekRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <View key={index} style={styles.weekDayColumn}>
                        <Text style={styles.dayLetter}>{day}</Text>
                        <View style={index === 2 ? styles.selectedDate : null}>
                            <Text style={index === 2 ? styles.selectedDateText : styles.dateNumber}>
                                {11 + index}
                            </Text>
                        </View>
                    </View>
                ))}
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
                                    <TouchableOpacity
                                        key={event.id}
                                        onPress={() => {
                                            setSelectedEvent(event);
                                            setModalVisible(true);
                                        }}
                                    >
                                        <View style={[styles.eventBlock, { height: Math.max(20, event.duration / 60) }]}>
                                            <Text style={styles.eventText}>{event.name}</Text>
                                            <Text style={styles.eventSubText}>
                                                {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            {/* --- TIMER BAR OR EVENT DETAIL --- */}
            <View style={styles.timerBar}>
                {isTracking ? (
                    <View style={styles.timerActive}>
                        <View>
                            <Text style={styles.timerText}>
                                {new Date(elapsedTime * 1000).toISOString().substr(11, 8)}
                            </Text>
                            <Text style={styles.sessionName}>{sessionName}</Text>
                        </View>
                        <View style={styles.timerControls}>
                            <TouchableOpacity style={styles.controlButton} onPress={isPaused ? resumeTracking : pauseTracking}>
                                <Ionicons name={isPaused ? 'play' : 'pause'} size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlButton} onPress={stopTracking}>
                                <Ionicons name="stop" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <TextInput
                            style={styles.timerInput}
                            placeholder="What are you working on?"
                            placeholderTextColor="#999"
                            value={sessionName}
                            onChangeText={setSessionName}
                        />
                        <TouchableOpacity style={styles.startButton} onPress={startTracking}>
                            <Ionicons name="play" size={20} color="white" />
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* --- MODAL (Optional - Will Replace With Sliding Panel) --- */}
            {selectedEvent && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackdrop}>
                        <View style={styles.modalContent}>
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
                            <Text style={styles.modalLabel}>Start Time:</Text>
                            <Text style={styles.modalTime}>
                                {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <Text style={styles.modalLabel}>End Time:</Text>
                            <Text style={styles.modalTime}>
                                {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <Text style={styles.modalLabel}>Active Time:</Text>
                            <Text style={styles.modalValue}>{formatSeconds(selectedEvent.active)}</Text>
                            <Text style={styles.modalLabel}>Rest Time:</Text>
                            <Text style={styles.modalValue}>{formatSeconds(selectedEvent.rest)}</Text>
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

// 🧾 STYLE DEFINITIONS FOR THE CALENDAR SCREEN
const styles = StyleSheet.create({

    // --- MAIN SCREEN LAYOUT ---
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#fefefe',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 90, // Makes space for bottom UI like timer bar
    },
  
    // --- HEADER (Top Bar) ---
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    settingsIcon: {
      fontSize: 22,
    },
  
    // --- DATE & TIME SECTION ---
    dateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    dateText: {
      fontSize: 16,
      color: '#444',
    },
    timeText: {
      fontSize: 16,
      color: '#999',
    },
  
    // --- WEEKDAYS ROW (M T W T F S S + Dates) ---
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 10,
    },
    weekDayColumn: {
      alignItems: 'center',
      flex: 1,
    },
    dayLetter: {
      fontSize: 16,
      color: '#333',
      marginBottom: 4,
    },
    dateNumber: {
      fontSize: 14,
      color: '#666',
    },
    selectedDate: {
      backgroundColor: '#333',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    selectedDateText: {
      color: 'white',
      fontSize: 14,
    },
  
    // --- TIME GRID ---
    timeGrid: {
      marginTop: 10,
      maxHeight: 600,
    },
    timeSlot: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      height: 60,
    },
    timeLabelContainer: {
      width: 60,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
    },
    timeLabel: {
      fontSize: 14,
      color: '#999',
    },
    timeSlotContent: {
      flex: 1,
      borderTopWidth: 1,
      borderColor: '#eee',
      paddingTop: 6,
      paddingLeft: 10,
    },
    hourLine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: '#eee',
    },
  
    // --- EVENT BLOCKS ---
    eventBlock: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
      padding: 6,
      marginTop: 6,
      marginRight: 12,
    },
    eventText: {
      color: 'white',
      fontSize: 12,
    },
    eventSubText: {
      color: '#ccc',
      fontSize: 10,
      marginTop: 2,
    },
  
    // --- TIMER BAR (BOTTOM UI BEFORE/AFTER TRACKING) ---
    timerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderColor: '#eee',
      marginTop: 10,
    },
    timerInput: {
      flex: 1,
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 100,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    startButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    timerActive: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
    },
    timerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    sessionName: {
      fontSize: 14,
      color: '#666',
    },
    timerControls: {
      flexDirection: 'row',
      gap: 10,
    },
    controlButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 8,
      marginLeft: 8,
    },
    playIcon: {
      fontSize: 18,
      color: 'white',
    },
  
    // --- MODAL (WILL BE REPLACED BY BOTTOM SHEET) ---
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: '85%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalTitleInput: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 4,
    },
    modalLabel: {
      fontSize: 14,
      color: '#666',
      marginTop: 12,
    },
    modalTime: {
      fontSize: 16,
      color: '#333',
    },
    modalValue: {
      fontSize: 16,
      color: '#007AFF',
      marginBottom: 4,
    },
    modalCloseButton: {
      marginTop: 20,
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalCloseText: {
      color: 'white',
      fontWeight: 'bold',
    },

});
