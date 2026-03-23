<%@ page import="com.geovendor.entity.*,java.util.*" %>


    <style>
        #monthlyChart {
            width: 100% !important;
            height: auto !important;
            max-height: 300px;
        }
    </style>

    <% LinkedHashMap<String, Integer> yearMonthMap = (LinkedHashMap<String, Integer>)
            request.getAttribute("monthlyData");

            String labels = "";
            String values = "";

            for (Map.Entry<String, Integer> entry : yearMonthMap.entrySet()) {
                labels += "'" + entry.getKey() + "',"; // e.g., '2025-01'
                values += entry.getValue() + ",";
                }

                // Remove trailing commas
                if (!labels.isEmpty()) labels = labels.substring(0, labels.length() - 1);
                if (!values.isEmpty()) values = values.substring(0, values.length() - 1);
                %>



                <div class="chart-container" style="position: relative; height:300px; width:100%">
                    <canvas id="monthlyChart"></canvas>
                </div>








                <script>
                    window.addEventListener('load', function () {
                        const ctx1 = document.getElementById('monthlyChart').getContext('2d');
                        new Chart(ctx1, {
                            type: 'bar',
                            data: {
                                labels: [<%= labels %>],
                                datasets: [{
                                    label: 'Contacts per Month',
                                    data: [<%= values %>],
                                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                                    borderColor: 'rgba(37, 99, 235, 1)',
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    maxBarThickness: 40
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                },
                                scales: {
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        },
                                        grid: {
                                            borderDash: [5, 5]
                                        }
                                    }
                                }
                            }
                        });
                    });

                </script>