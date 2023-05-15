import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const AppointmentScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const db = firebase.firestore();
    const appointmentRef = db.collection("appointment")
    .where("status", "==", "Pending");
    appointmentRef.onSnapshot((querySnapshot) => {
      const appointments = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          contactNumber: data.contactNumber,
          selectedDate: data.selectedDate,
          status: data.status,
          time: data.time,
        });
      });
      setAppointments(appointments);
    });
  }, []);

  const renderAppointment = ({ item }) => {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
              alignContent: "center",
  
            }}
          >
            {/* <Text style={styles.data}>{item.time}</Text> */}
            <Text style={styles.data}>{item.selectedDate}</Text>
            <Text style={styles.data}>{item.status}</Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => setSelectedAppointment(item)}
            >
                            <Text style={styles.viewButtonText}>View</Text>

            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const closeModal = () => {
    setSelectedAppointment(null);
  };

  const acceptAppointment = () => {
    const db = firebase.firestore();
    const appointmentRef = db.collection("appointment").doc(selectedAppointment.id);
    appointmentRef.update({
      status: "Accepted"
    });
    closeModal();
    
    // reload the page to see the changes


  };

  const declineAppointment = () => {
    const db = firebase.firestore();
    const appointmentRef = db.collection("appointment").doc(selectedAppointment.id);
    appointmentRef.update({
      status: "Declined"
    });
    closeModal();
    // reload the page to see the changes


  };

  return (
    <View >
      {/* <Text style={styles.heading}>Appointment List</Text> */}
      <View style={styles.headers}>
      <Text style={styles.header}>Profile</Text>
        {/* <Text style={styles.header}>Time</Text> */}
        <Text style={styles.header}>Date</Text>
        <Text style={styles.header}>Status</Text>
      </View>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
      />
      <Modal visible={selectedAppointment !== null} animationType="slide">
        {selectedAppointment && (
          <View style={styles.modal}>
            <Text style={styles.modalHeading}>Appointment Details</Text>
            <Text style={styles.modalText}>Name: {selectedAppointment.name}</Text>
            <Text style={styles.modalText}>
             Email: {selectedAppointment.email}
            </Text>
            <Text style={styles.modalText}>Contact Number: {selectedAppointment.contactNumber}</Text>
            <Text style={styles.modalText}>Time: {selectedAppointment.time}</Text>
            <Text style={styles.modalText}>Date: {selectedAppointment.selectedDate}</Text>
<View style={styles.modalButtonsContainer}>
<TouchableOpacity style={styles.acceptButton} onPress={acceptAppointment}>
<Text style={styles.acceptButtonText}>Accept</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.declineButton} onPress={declineAppointment}>
<Text style={styles.declineButtonText}>Decline</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.closeButton} onPress={closeModal}>
<Text style={styles.closeButtonText}>Close</Text>
</TouchableOpacity>
</View>
</View>
)}
</Modal>
</View>
);
};

const styles = StyleSheet.create({
container: {
flex: 1,
flexDirection: "row",
alignItems: "center",
marginVertical: 10,
marginHorizontal: 20,
backgroundColor: "#fff",
borderRadius: 10,
elevation: 3,
height: 100,
width: 300,
paddingVertical: 10,
// paddingHorizontal: 20,
},
scrollView: {
flexGrow: 1,
marginRight: 10,
},
viewButton: {
width: 50,
height: 30,
borderRadius: 30,
backgroundColor: "#FF6C44",
alignItems: "center",
justifyContent: "center",
},
viewButtonText: {
color: "#fff",
fontWeight: "bold",
},
data: {
marginHorizontal: 10,
fontWeight: "bold",
alignSelf: "center",
flex: 1,
},
header: {
marginHorizontal: 10,
fontWeight: "bold",
alignSelf: "center",
flex: 1,
},
headers: {
flexDirection: "row",
justifyContent: "space-between",
marginVertical: 10,
alignContent: "center",
marginHorizontal: 20,
},
heading: {
fontSize: 20,
fontWeight: "bold",
marginVertical: 20,
marginTop: 40,
marginHorizontal: 20,
color: "#fff",
},
modal: {
flex: 1,
justifyContent: "center",
alignItems: "center",
margin: 20,
},
modalHeading: {
fontSize: 24,
fontWeight: "bold",
marginBottom: 20,
},
modalText: {
fontSize: 16,
marginVertical: 5,
},
modalButtonsContainer: {
flexDirection: "row",
justifyContent: "space-between",
width: "100%",
marginTop: 20,
},
acceptButton: {
backgroundColor: "#4CAF50",
borderRadius: 5,
padding: 10,
width: 100,
alignItems: "center",
},
acceptButtonText: {
color: "white",
fontWeight: "bold",
},
declineButton: {
backgroundColor: "#FF6C44",
borderRadius: 5,
padding: 10,
width: 100,
alignItems: "center",
},
declineButtonText: {
color: "white",
fontWeight: "bold",
},
closeButton: {
backgroundColor: "#2196F3",
borderRadius: 5,
padding: 10,
width: 100,
alignItems: "center",
},
closeButtonText: {
color: "white",
fontWeight: "bold",
},
});

export default AppointmentScreen;
