<%@page import="com.geovendor.entity.*,java.util.*" %>
	<!DOCTYPE html>
	<html>

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Feedback | GeoVendor</title>

		<!-- Google Fonts: Inter -->
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
			rel="stylesheet">

		<%@include file="/WEB-INF/views/common/all_css.html" %>
			<style>
				body {
					font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
				}

				/* ===== Background Wrapper ===== */
				.feedback-wrapper {
					background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
					min-height: 100vh;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 40px 15px;
					position: relative;
					overflow-x: hidden;
					margin-top: 60px;
				}

				.feedback-wrapper::before {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: url("/images/bg_map.png") no-repeat center center/cover;
					opacity: 0.2;
					filter: grayscale(15%);
					pointer-events: none;
				}

				/* ===== Form Card ===== */
				.feedback-card {
					background: #ffffff;
					box-shadow: 0 20px 40px -5px rgba(148, 163, 184, 0.15);
					border: 1px solid #f1f5f9;
					border-radius: 24px;
					padding: 45px 40px;
					position: relative;
					z-index: 2;
					max-width: 580px;
					width: 100%;
					animation: fadeUp 0.7s ease-out;
				}

				.feedback-card h2 {
					font-family: 'Inter', sans-serif;
					color: #0f172a;
					font-weight: 800;
					letter-spacing: -1px;
					margin-bottom: 2rem;
					font-size: 1.75rem;
				}

				/* ===== Form Fields ===== */
				.feedback-card .form-floating>.form-control,
				.feedback-card .form-floating>textarea.form-control,
				.feedback-card .form-select {
					border: 1px solid #e2e8f0;
					background: #f8fafc;
					border-radius: 12px;
					font-family: 'Inter', sans-serif;
				}

				.feedback-card .form-floating>.form-control:focus,
				.feedback-card .form-floating>textarea.form-control:focus,
				.feedback-card .form-select:focus {
					background: white;
					border-color: #2563eb;
					box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
				}

				.feedback-card .form-floating>label {
					color: #64748b;
					font-family: 'Inter', sans-serif;
				}

				/* Input Group Styling */
				.feedback-card .input-group-text {
					background: #f8fafc;
					border: 1px solid #e2e8f0;
					color: #64748b;
					border-radius: 12px 0 0 12px;
				}

				.feedback-card .input-group .form-control,
				.feedback-card .input-group .form-select {
					border-radius: 0 12px 12px 0;
				}

				/* ===== Submit Button ===== */
				.btn-platinum-submit {
					background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
					color: white;
					padding: 14px 28px;
					border-radius: 50px;
					font-weight: 600;
					font-family: 'Inter', sans-serif;
					border: none;
					box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
					transition: all 0.3s ease;
					font-size: 15px;
				}

				.btn-platinum-submit:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
					color: white;
				}

				.btn-platinum-submit i {
					margin-right: 6px;
				}

				/* ===== Pin ===== */
				.pin-img {
					position: absolute;
					bottom: 20px;
					right: 20px;
					height: 40px;
					width: 50px;
					opacity: 0;
					transform: translateY(20px);
					animation: fadeInUp 1s forwards 0.8s;
					z-index: 2;
				}

				/* ===== Animations ===== */
				@keyframes fadeUp {
					from {
						opacity: 0;
						transform: translateY(25px);
					}

					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes fadeInUp {
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				/* ===== Responsive ===== */
				@media (max-width: 768px) {
					.feedback-card {
						padding: 30px 20px;
						margin: 0 10px;
					}

					.feedback-wrapper {
						padding: 20px 10px;
					}
				}
			</style>
	</head>

	<body>
		<div class="feedback-wrapper">
			<% String email=(String)session.getAttribute("sessionEmail"); if(email==null||session.isNew()){
				request.setAttribute("message","Please Login to Continue"); RequestDispatcher
				rd=request.getRequestDispatcher("/user/user_login.jsp"); rd.forward(request, response); } else { User
				u=(User) request.getAttribute("user"); String uploadPath=request.getContextPath(); String
				imagePath=uploadPath + "/" + u.getProfile_pic(); String mess=(String) request.getAttribute("message");
				if (mess !=null) { %>
				<div class="alert alert-info alert-dismissible fade show" role="alert"
					style="margin-top: 60px; position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 9999; border-radius: 12px;">
					<h4>
						<%=mess%>
					</h4>
					<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>
				<% } %>

					<%@include file="/WEB-INF/views/user/user_header.html" %>

						<div class="feedback-card">
							<h2 class="text-center">Feedback</h2>
							<form action="/user/feedback" method="post" novalidate class="needs-validation">

								<div class="mb-3 input-group">
									<span class="input-group-text"><i class="far fa-address-card"></i></span>
									<div class="form-floating">
										<input type="text" name="name" placeholder="Enter Name" class="form-control"
											required value="<%=u.getName()%>" readonly="readonly">
										<div class="invalid-feedback">Please Provide Your Name</div>
										<label for="name">Name</label>
									</div>
								</div>

								<div class="mb-3 input-group">
									<span class="input-group-text"><i class="far fa-envelope-open"></i></span>
									<div class="form-floating">
										<input type="email" name="email" placeholder="Enter Email" class="form-control"
											required value="<%=u.getEmail()%>" readonly="readonly">
										<label for="email">Email-ID</label>
										<div class="invalid-feedback">Please Provide Your Email</div>
									</div>
								</div>

								<div class="mb-3 input-group">
									<span class="input-group-text"><i class="fa fa-star"></i></span>
									<select name="rating" class="form-select" required>
										<option value="" selected disabled>Rating...</option>
										<option value="fas fa-star,fas fa-star,fas fa-star,fas fa-star,fas fa-star">
											⭐⭐⭐⭐⭐</option>
										<option value="fas fa-star,fas fa-star,fas fa-star,fas fa-star">⭐⭐⭐⭐
										</option>
										<option value="fas fa-star,fas fa-star,fas fa-star">⭐⭐⭐</option>
										<option value="fas fa-star,fas fa-star">⭐⭐</option>
										<option value="fas fa-star">⭐</option>
									</select>
									<div class="invalid-feedback">Please Provide Rating</div>
								</div>

								<div class="mb-3 input-group">
									<span class="input-group-text"><i class="far fa-comment"></i></span>
									<div class="form-floating">
										<textarea class="form-control" placeholder="remark" name="remark"
											required></textarea>
										<label for="remark">Remark</label>
										<div class="invalid-feedback">Please Provide Remark</div>
									</div>
								</div>

								<div class="text-center mb-3">
									<button class="btn-platinum-submit">
										<i class="fas fa-paper-plane"></i> Submit Feedback
									</button>
								</div>
							</form>
						</div>

						<img src="/images/pin.gif" alt="pin-img" class="pin-img">
		</div>

		<%@ include file="/WEB-INF/views/common/footer.html" %>
			<script src="/js/validation.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
				crossorigin="anonymous"></script>
			<% } %>
	</body>

	</html>