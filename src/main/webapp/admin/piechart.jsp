<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@page import="gv.dao.*" %>
        <%@page import="gv.beans.*" %>
            <%@page import="java.util.*" %>
                <style>
                    #pieChart {
                        width: 100% !important;
                        height: auto !important;
                        max-height: 300px;
                    }
                </style>


                <% AdminDao dao=new AdminDao(); HashMap<String, Integer> count_map = dao.count_rating();
                    pageContext.setAttribute("feedbackData", count_map);

                    Map<String, Integer> ratingData = (Map<String, Integer>) pageContext.getAttribute("feedbackData");
                            System.out.println("On jsp "+ratingData);
                            int fiveStarCount = 0;
                            int fourStarCount = 0;
                            int threeStarCount = 0;
                            int twoStarCount = 0;
                            int oneStarCount = 0;


                            if (ratingData != null) {
                            fiveStarCount = ratingData.getOrDefault("five_star", 0);
                            fourStarCount = ratingData.getOrDefault("four_star", 0);
                            threeStarCount = ratingData.getOrDefault("three_star", 0);
                            twoStarCount = ratingData.getOrDefault("two_star", 0);
                            oneStarCount = ratingData.getOrDefault("one_star", 0);
                            }


                            %>

                            <div class="chart-container"
                                style="position: relative; height:300px; width:100%; display: flex; justify-content: center;">
                                <canvas id="pieChart"></canvas>
                            </div>

                            <script>
                                window.addEventListener('load', function () {
                                    const ctx = document.getElementById('pieChart').getContext('2d');
                                    new Chart(ctx, {
                                        type: 'pie',
                                        data: {
                                            labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
                                            datasets: [{
                                                label: 'Star Rating Distribution',
                                                data: [<%= fiveStarCount %>, <%= fourStarCount %>, <%= threeStarCount %>, <%= twoStarCount %>, <%= oneStarCount %>],
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.6)',
                                                    'rgba(54, 162, 235, 0.6)',
                                                    'rgba(255, 206, 86, 0.6)',
                                                    'rgba(75, 192, 192, 0.6)',
                                                    'rgba(153, 102, 255, 0.6)'
                                                ],
                                                borderColor: [
                                                    'rgba(255, 99, 132, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                    'rgba(255, 206, 86, 1)',
                                                    'rgba(75, 192, 192, 1)',
                                                    'rgba(153, 102, 255, 1)'
                                                ],
                                                borderWidth: 1
                                            }]
                                        },
                                        options: {
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom'
                                                }
                                            }
                                        }
                                    });
                                });
                            </script>