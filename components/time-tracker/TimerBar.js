import React from 'react'; // lets us use React features
import { View, Text, TouchableOpacity, TextInput } from 'react-native'; // basic UI components
import { Ionicons } from '@expo/vector-icons'; // icon library for play/pause/stop buttons

// Main TimerBar component. The bottom section of the screen where the timer lives
export default function TimerBar({
    isTracking,              // true if a session is currently running
    isPaused,                // true if the session is paused
    elapsedTime,             // total time passed in seconds
    sessionName,             // name of the current session
    onChangeSessionName,     // function to update the session name
    onStart,                 // function to start a session
    onPause,                 // function to pause the session
    onResume,                // function to resume the session
    onStop,                  // function to stop the session
    styles                   // styling passed in from outside
}) {
  // When the timer is running: show elapsed time, session name, and buttons
  const renderActiveSession = () => (
    <View style={styles.timerActive}>
      <View>
        
        <Text style={styles.timerText}> 
          {new Date(elapsedTime * 1000).toISOString().substr(11, 8)} 
        </Text>
        <Text style={styles.sessionName}>{sessionName}</Text> 
      </View>
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={isPaused ? onResume : onPause}
        >
          <Ionicons name={isPaused ? 'play' : 'pause'} size={20} color="white" /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onStop}> 
          <Ionicons name="stop" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // When no session is active: show input box and play button
  const renderIdleState = () => (
    <>
      <TextInput
        style={styles.timerInput}
        placeholder="What are you working on?" // hint text inside input box
        placeholderTextColor="#999"
        value={sessionName} // what's written in the box
        onChangeText={onChangeSessionName} // update text when typing
      />
      <TouchableOpacity style={styles.startButton} onPress={onStart}> 
        <Ionicons name="play" size={20} color="white" />
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.timerBar}> 
      {isTracking ? renderActiveSession() : renderIdleState()} 
    </View>
  );
}
