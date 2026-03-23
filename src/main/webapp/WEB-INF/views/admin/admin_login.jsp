<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<!DOCTYPE html>
	<html>

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Admin Login - GeoVendor</title>
		<%@include file="/WEB-INF/views/common/all_css.html" %>
			<style>
				body {
					background: #f8fafc;
					font-family: 'Inter', sans-serif;
					min-height: 100vh;
					display: flex;
					flex-direction: column;
				}

				.login-wrapper {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					background: radial-gradient(circle at top right, #f1f5f9 0%, #cbd5e1 100%);
					overflow: hidden;
					padding: 20px;
				}

				.login-wrapper::before {
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

				.admin-login-card {
					background: white;
					border: 1px solid rgba(255, 255, 255, 0.8);
					border-radius: 24px;
					padding: 40px;
					width: 100%;
					max-width: 450px;
					box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
					position: relative;
					z-index: 2;
					backdrop-filter: blur(10px);
				}

				.login-header {
					text-align: center;
					margin-bottom: 32px;
				}

				.login-header h1 {
					font-size: 1.75rem;
					font-weight: 800;
					color: #0f172a;
					letter-spacing: -0.5px;
					margin-bottom: 8px;
				}

				.login-header p {
					color: #64748b;
					font-size: 0.95rem;
				}

				.input-group-custom {
					margin-bottom: 20px;
				}

				.input-group-custom label {
					display: block;
					font-size: 0.85rem;
					font-weight: 600;
					color: #475569;
					margin-bottom: 8px;
					margin-left: 4px;
				}

				.form-control-custom {
					width: 100%;
					padding: 14px 20px;
					background: #f1f5f9;
					border: 2px solid transparent;
					border-radius: 14px;
					font-size: 1rem;
					transition: all 0.2s ease;
					color: #1e293b;
				}

				.form-control-custom:focus {
					background: white;
					border-color: var(--primary);
					box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
					outline: none;
				}

				.btn-login {
					width: 100%;
					padding: 14px;
					background: var(--primary);
					color: white;
					border: none;
					border-radius: 14px;
					font-weight: 700;
					font-size: 1rem;
					margin-top: 10px;
					box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
					transition: all 0.2s ease;
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 10px;
				}

				.btn-login:hover {
					transform: translateY(-2px);
					box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.4);
					background: var(--primary-dark);
				}

				.alert-custom {
					border-radius: 12px;
					margin-bottom: 24px;
					font-size: 0.9rem;
					font-weight: 500;
				}
			</style>
	</head>

	<body>
		<div class="login-wrapper">
			<div class="admin-login-card">
				<div class="login-header">
					<h1>Admin Portal</h1>
					<p>Sign in to manage GeoVendor</p>
				</div>

				<% String mess=(String) request.getAttribute("msg"); if (mess !=null) { %>
					<div class="alert alert-info alert-dismissible fade show alert-custom" role="alert">
						<i class="fas fa-info-circle me-2"></i>
						<%=mess%>
							<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
					</div>
					<% } %>

						<form action="/admin/login" method="post" novalidate class="needs-validation">
							<div class="input-group-custom">
								<label>Email Address</label>
								<input type="email" name="email" placeholder="admin@geovendor.com"
									class="form-control-custom" required>
								<div class="invalid-feedback">Please provide a valid email</div>
							</div>

							<div class="input-group-custom">
								<label>Password</label>
								<input type="password" name="password" placeholder="••••••••"
									class="form-control-custom" required>
								<div class="invalid-feedback">Please enter your password</div>
							</div>

							<button type="submit" class="btn-login">
								<i class="fas fa-sign-in-alt"></i> Access Dashboard
							</button>
						</form>
			</div>
		</div>

		<%@ include file="/WEB-INF/views/common/footer.html" %>
			<script src="/js/validation.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
				integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
				crossorigin="anonymous"></script>
	</body>

	</html>