<%@page import="gv.utilities.CustomMessages" %>
	<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
		<!DOCTYPE html>
		<html>

		<head>
			<meta charset="UTF-8">
			<title>Admin home</title>
			<%@include file="/common_html/all_css.html" %>
				<style>
					body {
						background-color: #f8fafc;
						font-family: 'Inter', sans-serif;
					}

					.dashboard-hero {
						background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
						position: relative;
						padding: 120px 0 60px;
						text-align: center;
						overflow: hidden;
						margin-bottom: 40px;
					}

					.dashboard-hero::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: url("/GeoVendor/images/bg_map.png") no-repeat center center/cover;
						opacity: 0.1;
						pointer-events: none;
					}

					.hero-content {
						position: relative;
						z-index: 2;
					}

					.hero-title {
						font-size: 2.5rem;
						font-weight: 800;
						color: #0f172a;
						letter-spacing: -1px;
						margin-bottom: 12px;
					}

					.hero-title span {
						background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
					}

					.hero-subtitle {
						font-size: 1.1rem;
						color: #64748b;
						font-weight: 400;
					}

					.dashboard-container {
						max-width: 1200px;
						margin: 0 auto;
						padding: 0 20px 80px;
					}

					.stats-grid {
						display: grid;
						grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
						gap: 30px;
						margin-bottom: 40px;
					}

					.chart-card {
						background: white;
						border-radius: 24px;
						padding: 30px;
						box-shadow: 0 4px 15px -3px rgba(148, 163, 184, 0.1);
						border: 1px solid #f1f5f9;
						transition: transform 0.3s ease;
					}

					.chart-card:hover {
						transform: translateY(-5px);
						box-shadow: 0 12px 25px -5px rgba(148, 163, 184, 0.15);
					}

					.chart-title {
						font-size: 1.1rem;
						font-weight: 700;
						color: #1e293b;
						margin-bottom: 25px;
						padding-bottom: 15px;
						border-bottom: 1px solid #f1f5f9;
						display: flex;
						align-items: center;
						gap: 10px;
					}

					.chart-title i {
						color: var(--primary);
					}

					.pin-img {
						position: absolute;
						bottom: 20px;
						right: 20px;
						opacity: 0.5;
					}
				</style>
		</head>

		<body>
			<% String email=(String)session.getAttribute("sessionEmail"); if(email==null||session.isNew()){
				request.setAttribute("message",CustomMessages.AUTHORISE_ERROR); RequestDispatcher
				rd=request.getRequestDispatcher("/admin/admin_login.jsp"); rd.forward(request, response); } else{ %>

				<%@include file="/admin/admin_header.html" %>

					<!-- Hero Section -->
					<section class="dashboard-hero">
						<div class="hero-content">
							<h1 class="hero-title">Welcome Back, <span>Admin</span></h1>
							<p class="hero-subtitle">GeoVendor Management & Analytics Overview</p>
						</div>
						<img alt="pin-img" src="/GeoVendor/images/pin.gif" height="40" width="50" class="pin-img">
					</section>

					<!-- Dashboard Content -->
					<div class="dashboard-container">
						<div class="stats-grid">
							<!-- Monthly Contacts Chart -->
							<div class="chart-card">
								<h3 class="chart-title"><i class="fas fa-chart-bar"></i> Monthly Inquiries</h3>
								<%@include file="/admin/contact_count.jsp" %>
							</div>

							<!-- Rating Distribution Chart -->
							<div class="chart-card">
								<h3 class="chart-title"><i class="fas fa-chart-pie"></i> User Feedback Ratings</h3>
								<%@include file="/admin/piechart.jsp" %>
							</div>
						</div>
					</div>

					<%@ include file="/WEB-INF/common/footer.html" %>
						<%} %>
							<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
								integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
								crossorigin="anonymous"></script>
		</body>

		</html>