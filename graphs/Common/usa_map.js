d3 = d3;

const state = {
    data: [],
    passengerClass: "",
    selectedSex: null,
    selectedSurvived: null
};

d3.csv("data/triggers/world_confirmed_cases.csv").then(data => {
    console.table(data);
});

