document.addEventListener("DOMContentLoaded", function() {
    const chartElement = document.getElementById("chart");
    let birthData = [];
    let deathData = [];

    const fetchBirthAndDeathData = async () => {
        const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
        
        const requestBody = {
            "query": [
                {
                    "code": "Vuosi",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007",
                            "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015",
                            "2016", "2017", "2018", "2019", "2020", "2021"
                        ]
                    }
                },
                {
                    "code": "Tiedot",
                    "selection": {
                        "filter": "item",
                        "values": ["syntyneet", "kuolleet"]
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

        birthData = data.value.filter((_, index) => data.dimension.Tiedot.category.label[index] === "syntyneet");
        deathData = data.value.filter((_, index) => data.dimension.Tiedot.category.label[index] === "kuolleet");

        initializeChart(birthData, deathData);
    };

    const initializeChart = (births, deaths) => {
        const labels = [
            "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007",
            "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015",
            "2016", "2017", "2018", "2019", "2020", "2021"
        ];

        const chart = new frappe.Chart(chartElement, {
            title: "Synnytykset ja kuolemat 2000-luvulla",
            data: {
                labels: labels,
                datasets: [
                    {
                        name: "Syntyneet",
                        type: "line",
                        values: births
                    },
                    {
                        name: "Kuolleet",
                        type: "line",
                        values: deaths
                    }
                ]
            },
            type: "line",
            height: 450,
            colors: ['#eb5146', '#3fba7a']
        });
    };

    fetchBirthAndDeathData();
});
