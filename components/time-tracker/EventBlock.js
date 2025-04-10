import React from 'react'; // import React so we can use components
import { View, Text, TouchableOpacity } from 'react-native'; // import UI components from React Native

// This component shows one time block in the calendar
export default function EventBlock({ event, onPress, styles }) {
  return (
    // When you tap the block, it runs the onPress function (like opening a detail view)
    <TouchableOpacity onPress={onPress}>
      
      {/* The outer box of the event block */}
      <View
        style={[
          styles.eventBlock, // default style for the block
          { height: Math.max(20, event.duration / 60) } // make the block taller for longer sessions (1 min = 1px, but never less than 20px)
        ]}
      >
        {/* Show the session name inside the block */}
        <Text style={styles.eventText}>{event.name}</Text> 
        
        {/* Show the start and end time below the name */}
        <Text style={styles.eventSubText}>
          {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text> 
      </View>
    </TouchableOpacity>
  );
}

