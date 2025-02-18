import React, { useState, useEffect } from 'react';
import { FlatList, Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

let originalData = [];

const HomeScreen = ({ navigation }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("https://data.gov.sg/api/action/datastore_search?resource_id=d_dc92b9d107acfa23e1df76b1a33ffb4a")
            .then((response) => response.json())
            .then((json) => {
                if (originalData.length < 1) {
                    setData(json.result.records);
                    originalData = json.result.records;
                }
                setData(json.result.records);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filterData = (text) => {
        if (text !== '') {
            let filteredData = originalData.filter((item) =>
                (item.school && item.school.toLowerCase().includes(text.toLowerCase())) ||
                (item.year && item.year.toString().includes(text))
            );
            setData(filteredData);
        } else {
            setData(originalData);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Details', { item })}
        >
            <Text style={styles.yearText}>{item.year}</Text>
            <Text style={styles.schoolText}>{item.school}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>School Staff and Enrollment Tracker</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search by school or year"
                onChangeText={(text) => filterData(text)}
            />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
            />
        </View>
    );
};

const DetailsScreen = ({ route }) => {
    const { item } = route.params;

    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>{item.school} ({item.year})</Text>
            <Text style={styles.detailsText}>Sex: {item.sex}</Text>
            <Text style={styles.detailsText}>Student Enrollment: {item.student_enrolment}</Text>
            <Text style={styles.detailsText}>Number of Teachers: {item.no_of_teacher}</Text>
            <Text style={styles.detailsText}>Number of Vice Principals: {item.no_of_vice_principal}</Text>
            <Text style={styles.detailsText}>Number of Principals: {item.no_of_principal}</Text>
            <Text style={styles.detailsText}>Number of Education Partners: {item.no_of_education_partners}</Text>
        </View>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'School List' }} />
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'School Details' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50',
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#3498db',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 16,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    yearText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    schoolText: {
        fontSize: 16,
        color: '#34495e',
        marginTop: 4,
    },
    detailsContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2c3e50',
    },
    detailsText: {
        fontSize: 16,
        color: '#34495e',
        marginBottom: 8,
    },
});

export default App;
