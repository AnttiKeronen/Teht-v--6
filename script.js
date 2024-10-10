document.addEventListener("DOMContentLoaded", function() {
    const chartElement = document.getElementById("chart");
    let municipalityCodes = {};
    let chart; 
    let populationData = []; 
   
    const fetchMunicipalityCodes = async () => {
        const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
        const response = await fetch(url);
        const data = await response.json();
       
        const codes = data.variables[1].values; 
        const names = data.variables[1].valueTexts;
        names.forEach((name, index) => {
            municipalityCodes[name.toLowerCase()] = codes[index];
        });
    };

    
    const fetchPopulationData = async (areaCode) => {
        const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

        const requestBody = {
            "query": [
                {
                    "code": "Vuosi",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008",
                            "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017",
                            "2018", "2019", "2020", "2021"
                        ]
                    }
                },
                {
                    "code": "Alue",
                    "selection": {
                        "filter": "item",
                        "values": [areaCode] 
                    }
                },
                {
                    "code": "Tiedot",
                    "selection": {
                        "filter": "item",
                        "values": ["vaesto"]
                    }
                }
            ],
            "response": {
                "format": "json-stat2"
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();

        
        populationData = data.value; 

        
        if (chart) {
            chart.update({
                labels: ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
                         "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"],
                datasets: [
                    {
                        name: "Population", 
                        type: "line",
                        values: populationData
                    }
                ]
            });
        } else {
            chart = new frappe.Chart(chartElement, {
                title: "Populaation muutos 2000-luvulla",
                data: {
                    labels: ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
                             "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021"],
                    datasets: [
                        {
                            name: "Population", 
                            type: "line",
                            values: populationData
                        }
                    ]
                },
                type: "line", 
                height: 450, 
                colors: ['#eb5146'] 
            });
        }
    };

   
    const addPredictedData = () => {
        if (populationData.length < 2) {
            alert("Not enough data");
            return;
        }

        
        let deltas = [];
        for (let i = 1; i < populationData.length; i++) {
            deltas.push(populationData[i] - populationData[i - 1]);
        }
        const meanDelta = deltas.reduce((acc, delta) => acc + delta, 0) / deltas.length;
        const lastPopulationValue = populationData[populationData.length - 1];
        const predictedValue = lastPopulationValue + meanDelta;

        
        populationData.push(predictedValue);
        chart.update({
            labels: [...chart.data.labels, "2022"], 
            datasets: [
                {
                    name: "Population", 
                    type: "line",
                    values: populationData
                }
            ]
        });
    };

    fetchMunicipalityCodes();
    document.getElementById("submit-data").addEventListener("click", function() {
        const inputArea = document.getElementById("input-area").value.toLowerCase().trim();
        
        if (municipalityCodes[inputArea]) {
            fetchPopulationData(municipalityCodes[inputArea]);
        } else {
            alert("Not found.");
        }
    });
    document.getElementById("add-data").addEventListener("click", addPredictedData);
});



