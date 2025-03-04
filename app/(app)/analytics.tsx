import React, { useState } from "react";

import SafeContainer from "../../components/common/SafeContainer";
import withTabBar from "../../hoc/withTabBar";
import { Stack, useRouter } from "expo-router";
import HeaderTitle from "../../components/HeaderTitle";
import Text from "../../components/common/Text";
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  RadarChart,
} from "react-native-gifted-charts";
import { useAppContext } from "../../hook/useAppContext";
import { TouchableOpacity, View } from "react-native";
import { convertToDate, formatDate } from "../../lib/dateHelpers";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const lcomp = (val) => {
  return (
    <View style={{ width: 70, marginLeft: 7 }}>
      <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
    </View>
  );
};

const latestData = [
  {
    value: 100,

    labelComponent: () => lcomp("22 Nov"),
  },

  {
    value: 120,

    hideDataPoint: true,
  },

  {
    value: 210,
  },

  {
    value: 250,

    hideDataPoint: true,
  },

  {
    value: 320,

    labelComponent: () => lcomp("24 Nov"),
  },

  {
    value: 310,

    hideDataPoint: true,
  },

  {
    value: 270,
  },

  {
    value: 240,

    hideDataPoint: true,
  },

  {
    value: 130,

    labelComponent: () => lcomp("26 Nov"),
  },

  {
    value: 120,

    hideDataPoint: true,
  },

  {
    value: 100,
  },

  {
    value: 210,

    hideDataPoint: true,
  },

  {
    value: 270,

    labelComponent: () => lcomp("28 Nov"),
  },

  {
    value: 240,

    hideDataPoint: true,
  },

  {
    value: 120,

    hideDataPoint: true,
  },

  {
    value: 100,
  },

  {
    value: 210,

    labelComponent: () => lcomp("28 Nov"),
  },

  {
    value: 20,

    hideDataPoint: true,
  },

  {
    value: 100,
  },
];
const App = () => {
  const [currentData, setCurrentData] = useState(latestData);

  return (
    <View>
      <View
        style={{
          paddingVertical: 15,
          // backgroundColor: "#414141",
        }}
      >
        <LineChart
          isAnimated
          thickness={3}
          color="#07BAD1"
          // maxValue={600}
          noOfSections={3}
          animateOnDataChange
          animationDuration={1000}
          onDataChangeAnimationDuration={300}
          areaChart
          yAxisTextStyle={{ color: "lightgray", fontSize: 12 }}
          data={currentData}
          hideDataPoints
          startFillColor={"rgb(84,219,234)"}
          endFillColor={"rgb(84,219,234)"}
          startOpacity={0.4}
          endOpacity={0.1}
          spacing={22}
          backgroundColor="transparent"
          rulesColor="gray"
          rulesType="solid"
          initialSpacing={10}
          yAxisColor="lightgray"
          xAxisColor="lightgray"
          curved
          pointerConfig={{
            pointerStripHeight: 100,

            pointerStripColor: "lightgray",

            pointerStripWidth: 2,

            pointerColor: "lightgray",

            radius: 6,

            pointerLabelWidth: 100,

            pointerLabelHeight: 90,

            activatePointersOnLongPress: true,

            autoAdjustPointerLabelPosition: false,

            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,

                    width: 100,

                    justifyContent: "center",

                    marginTop: -30,

                    marginLeft: -40,
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: "center",
                    }}
                  >
                    {items[0].date} ds
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "white",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "blue",
                      }}
                    >
                      {"$" + items[0].value + ".0"} ??
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
};

const App2 = () => {
  const stackData = [
    {
      stacks: [
        { value: 10, color: "orange" },

        { value: 20, color: "#4ABFF4", marginBottom: 2 },
      ],

      label: "Jan",
    },

    {
      stacks: [
        { value: 10, color: "#4ABFF4" },

        { value: 11, color: "orange", marginBottom: 2 },

        { value: 15, color: "#28B2B3", marginBottom: 2 },
      ],

      label: "Mar",
    },

    {
      stacks: [
        { value: 14, color: "orange" },

        { value: 18, color: "#4ABFF4", marginBottom: 2 },
      ],

      label: "Feb",
    },

    {
      stacks: [
        { value: 7, color: "#4ABFF4" },

        { value: 11, color: "orange", marginBottom: 2 },

        { value: 10, color: "#28B2B3", marginBottom: 2 },
      ],

      label: "Mar",
    },
  ];

  return (
    <View>
      <BarChart
        width={340}
        rotateLabel
        noOfSections={4}
        stackData={stackData}
      />
    </View>
  );
};

function Example() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) => {
        console.log("QQQd");
        return res.json();
      }),
    staleTime: 1000 * 60 * 5, // 5minutes
    refetchOnWindowFocus: false,
  });

  if (isPending) return <Text>Loading...</Text>;

  if (error) return <Text>"An error has occurred: " + error.message</Text>;

  return (
    <View>
      <Text>DATA FETCHINH</Text>
      <Text>{data.name}</Text>
      <Text>{data.description}</Text>
      <Text>👀 {data.subscribers_count}</Text>
      <Text>✨ {data.stargazers_count}</Text>
      <Text>🍴 {data.forks_count}</Text>
    </View>
  );
}

const Analytics = () => {
  const router = useRouter();
  const { monthlyTransactions } = useAppContext();

  return (
    <SafeContainer hasHeader>
      <Stack.Screen
        options={{
          header: () => <HeaderTitle title="Analytics" />,
        }}
      />
      <Text>DATA</Text>
      <Example />
      <Text>6 months trend</Text>
      <Text>Monthly Spending Trend ( 6months</Text>
      <App />

      <Text>6 months trend categories with un catechori</Text>
      <Text>Category Breakdown (6 months)</Text>
      <App2 />
    </SafeContainer>
  );
};

const AnalyticsScreen = withTabBar(Analytics);

export default AnalyticsScreen;
