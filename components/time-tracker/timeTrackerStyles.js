// Import React Native's StyleSheet tool
import { StyleSheet } from 'react-native';


// All the styles used in the Time Tracker screen
const styles = StyleSheet.create({
    // The main screen container
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#fefefe',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 90,
    },
  
    // Top row with "Calendar" and gear icon
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
  
    // Row with the current date and time
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
  
    // Row showing M T W T F S S
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      marginTop: 10,
    },
  
    // Each day box
    day: {
      fontSize: 16,
      color: '#333',
      padding: 8,
      borderRadius: 20,
    },
  
    selectedDay: {
      backgroundColor: '#333',
      borderRadius: 20,
      padding: 8,
    },
  
    selectedDayText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
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
  
    // Scrollable area that shows all the time slots
    timeGrid: {
      marginTop: 10,
      maxHeight: 600,
    },
  
    // Layout for each time slot row
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
  
    // Right side of time slot (line + event blocks)
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
  
    // Event block style
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
  
    // The bar at the bottom for starting or stopping sessions
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
  
    // The background behind the modal window
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    // The modal card itself
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
      width: '85%',
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
  
  export default styles;
  