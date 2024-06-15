import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Modal from "react-native-modal";
import getMonthName from "@/components/utils/months";

export default function GoalsPage() {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState<any>(false);
  const [targetValue, setTargetValue] = useState<any>(0);
  const [progressData, setProgressData] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<any>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<any>(
    new Date().getFullYear()
  );
  const [selectedGoal, setSelectedGoal] = useState(200);

  const [isMonthListVisible, setMonthListVisible] = useState(false);
  const [isYearListVisible, setYearListVisible] = useState(false);
  const [isGoalVisible, setGoalVisible] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    label: `${new Date().getFullYear() - i}`,
    value: new Date().getFullYear() - i,
  }));

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  console.log("====================================");
  console.log("daysInMonth : ", daysInMonth);
  console.log("====================================");

  const handleDayPress = (day: any) => {
    setSelectedDate(`${selectedYear}-${selectedMonth}-${day}`);
    setTargetValue(
      progressData[`${selectedYear}-${selectedMonth}-${day}`] || 0
    );
    setModalVisible(true);
  };

  const handleSave = () => {
    setProgressData({
      ...progressData,
      [selectedDate]: targetValue,
    });
    setModalVisible(false);
  };
  const monthPickerValue = getMonthName(selectedMonth);

  const yearPickerValue =
    years.find((year) => year.value === selectedYear)?.label || "Select Year";

  const toggleMonthList = () => {
    setMonthListVisible(!isMonthListVisible);
  };

  const toggleYearList = () => {
    setYearListVisible(!isYearListVisible);
  };

  const toggleGoal = () => {
    setGoalVisible(!isGoalVisible);
  };

  const handleMonthSelect = (month: any) => {
    setSelectedMonth(month);
    setMonthListVisible(false);
  };

  const handleYearSelect = (year: any) => {
    setSelectedYear(year);
    setYearListVisible(false);
  };

  const screenWidth = Dimensions.get("window").width;
  const numColumns = 5;

  const cardWidth = (screenWidth - 60) / numColumns; // Ekran genişliğine göre kart genişliği hesaplanıyor

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pickerContainer}>
        <TouchableOpacity onPress={toggleMonthList}>
          <Text style={styles.pickerLabel}>{monthPickerValue}</Text>
        </TouchableOpacity>
        <Modal isVisible={isMonthListVisible}>
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.monthItem}
                  onPress={() => handleMonthSelect(item.value)}
                >
                  <Text>{getMonthName(item.label)}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value.toString()}
              contentContainerStyle={styles.monthListContainer}
            />
          </View>
        </Modal>

        <TouchableOpacity onPress={toggleYearList}>
          <Text style={styles.pickerLabel}>{yearPickerValue}</Text>
        </TouchableOpacity>
        <Modal isVisible={isYearListVisible}>
          <View style={styles.modalContent}>
            <FlatList
              data={years}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.monthItem}
                  onPress={() => handleYearSelect(item.value)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value.toString()}
              contentContainerStyle={styles.monthListContainer}
            />
          </View>
        </Modal>
      </View>

      <View style={styles.pickerContainer}>
        <TouchableOpacity onPress={toggleGoal}>
          <Text style={styles.pickerLabel}>
            Günlük Okuma Hedefim : {selectedGoal}{" "}
          </Text>
        </TouchableOpacity>
        <Modal isVisible={isGoalVisible}>
          <View></View>
        </Modal>
      </View>

      <FlatList
        data={Array.from({ length: daysInMonth }, (_, i) => i + 1)}
        renderItem={({ item }) => {
          const dateString = `${selectedYear}-${selectedMonth}-${item}`;
          const progress = progressData[dateString] || 0;
          return (
            <TouchableOpacity
              style={[
                styles.card,
                { width: cardWidth, margin: 5 }, // Kart genişliği ve kenar boşluğu ayarlanıyor
              ]}
              onPress={() => handleDayPress(item)}
            >
              <Text style={styles.cardTitle}>{item}</Text>
              <Text style={styles.progressText}>
                {progress >= selectedGoal
                  ? `✔️`
                  : `${(Number(progress) * 100) / selectedGoal}%`}
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.cardContainer}
      />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>Hedef Sayısı Girin:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={targetValue.toString()}
            onChangeText={(text) => setTargetValue(Number(text))}
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.inputSave}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f0f0f0",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 150,
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    margin: 8,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "12%",
    elevation: 3,
  },
  monthItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  monthListContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressText: {
    marginTop: 10,
    fontSize: 12,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    height: 40,
    borderColor: "#4E62C5",
    borderWidth: 0.5,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 15,
    width: "100%",
    textAlign: "center",
    paddingVertical: 25,
  },
  inputSave: {
    color: "#4E62C5",
  },
  saveButton: {
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#4E62C5",
    borderRadius: 15,
    elevation: 10,
  },
});
