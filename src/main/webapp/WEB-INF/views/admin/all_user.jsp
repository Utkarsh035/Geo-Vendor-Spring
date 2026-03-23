<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@page import="com.geovendor.entity.*,java.util.*" %>
		<!DOCTYPE html>
		<html>

		<head>
			<meta charset="UTF-8">
			<title>User List</title>
			<%@include file="/WEB-INF/views/common/all_css.html" %>
				<style>
					body {
						background-color: #f8fafc;
						font-family: 'Inter', sans-serif;
					}

					.page-hero {
						background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
						position: relative;
						padding: 120px 0 60px;
						text-align: center;
						overflow: hidden;
					}

					.page-hero::before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: url("/images/bg_map.png") no-repeat center center/cover;
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
					}

					.hero-title span {
						background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
						-webkit-background-clip: text;
						-webkit-text-fill-color: transparent;
						background-clip: text;
					}

					.listing-container {
						max-width: 1100px;
						margin: -40px auto 80px;
						padding: 0 20px;
						position: relative;
						z-index: 3;
					}

					.listing-card {
						background: white;
						border-radius: 20px;
						padding: 2px;
						box-shadow: 0 10px 25px -5px rgba(148, 163, 184, 0.15);
						border: 1px solid #f1f5f9;
						overflow: hidden;
					}

					.custom-table {
						margin-bottom: 0;
					}

					.custom-table thead th {
						background: #f8fafc;
						color: #64748b;
						font-weight: 700;
						text-transform: uppercase;
						font-size: 0.75rem;
						letter-spacing: 0.5px;
						padding: 16px 20px;
						border-bottom: 2px solid #f1f5f9;
					}

					.custom-table tbody td {
						padding: 16px 20px;
						color: #334155;
						vertical-align: middle;
						font-size: 0.95rem;
						border-bottom: 1px solid #f8fafc;
					}

					.custom-table tbody tr:hover {
						background-color: #f1f5f9;
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
			<%@include file="/WEB-INF/views/admin/admin_header.html" %>

				<!-- Hero Section -->
				<section class="page-hero">
					<div class="hero-content">
						<h1 class="hero-title">Registered <span>Users</span></h1>
					</div>
					<img alt="pin-img" src="/images/pin.gif" height="40" width="50" class="pin-img">
				</section>

				<div class="listing-container">
					<div class="listing-card">
						<% List<User> userList = (List<User>) request.getAttribute("userList");
								if(userList.size()>0){%>
								<table class="table custom-table table-hover">
									<thead>
										<tr>
											<th scope="col">Name</th>
											<th scope="col">Email</th>
											<th scope="col">Phone</th>
											<th scope="col">Address</th>
											<th scope="col">Join Date</th>
										</tr>
									</thead>
									<tbody>
										<% for(User u:userList){ %>
											<tr>
												<td style="font-weight: 600; color: #0f172a;">
													<%=u.getName() %>
												</td>
												<td>
													<%=u.getEmail() %>
												</td>
												<td>
													<%=u.getPhone()%>
												</td>
												<td>
													<%=u.getAddress()%>
												</td>
												<td>
													<%=u.getDate() %>
												</td>
											</tr>
											<%} %>
									</tbody>
								</table>
								<%} else{%>
									<div class="text-center p-5">
										<i class="fas fa-users-slash mb-3" style="font-size: 3rem; color: #cbd5e1;"></i>
										<h3 style="color: #64748b;">No Users Registered Yet</h3>
									</div>
									<%} %>
					</div>
				</div>


				<%@ include file="/WEB-INF/views/common/footer.html" %>
					<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
						integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
						crossorigin="anonymous"></script>
		</body>

		</html>