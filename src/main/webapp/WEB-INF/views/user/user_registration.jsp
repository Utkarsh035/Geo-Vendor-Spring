<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<% response.setHeader("Cache-Control","no-cache,no-store,must-revalidate"); response.setHeader("Pragma","no-cache");
		response.setDateHeader ("Expires", 0); %>
		<!DOCTYPE html>
		<html>

		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Registration | GeoVendor</title>

			<!-- Google Fonts: Inter -->
			<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
				rel="stylesheet">

			<%@include file="/WEB-INF/views/common/all_css.html" %>
				<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

				<style>
					/* ===== Platinum Toast ===== */
					.toast-platinum {
						position: fixed;
						top: 100px;
						left: 50%;
						transform: translateX(-50%) translateY(-20px);
						min-width: 280px;
						max-width: 400px;
						padding: 16px 28px;
						background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
						color: #fff;
						border-radius: 14px;
						box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
						opacity: 0;
						transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
						z-index: 9999;
						font-family: 'Inter', sans-serif;
						text-align: center;
						font-size: 15px;
						font-weight: 500;
					}

					.toast-platinum.show {
						opacity: 1;
						transform: translateX(-50%) translateY(0);
					}

					/* ===== Background Wrapper ===== */
					.reg-wrapper {
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

					.reg-wrapper::before {
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
					.reg-card {
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

					.reg-card h2 {
						font-family: 'Inter', sans-serif;
						color: #0f172a;
						font-weight: 800;
						letter-spacing: -1px;
						margin-bottom: 2rem;
						font-size: 1.75rem;
					}

					/* ===== Form Fields ===== */
					.reg-card .form-floating>.form-control,
					.reg-card .form-floating>textarea.form-control,
					.reg-card .form-select {
						border: 1px solid #e2e8f0;
						background: #f8fafc;
						border-radius: 12px;
						font-family: 'Inter', sans-serif;
					}

					.reg-card .form-floating>.form-control:focus,
					.reg-card .form-floating>textarea.form-control:focus,
					.reg-card .form-select:focus {
						background: white;
						border-color: #2563eb;
						box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
					}

					.reg-card .form-floating>label {
						color: #64748b;
						font-family: 'Inter', sans-serif;
					}

					/* ===== Submit Button ===== */
					.btn-platinum-submit {
						background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
						color: white;
						padding: 14px;
						border-radius: 50px;
						font-weight: 600;
						font-family: 'Inter', sans-serif;
						border: none;
						box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
						transition: all 0.3s ease;
						font-size: 15px;
						letter-spacing: 0.3px;
					}

					.btn-platinum-submit:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
						color: white;
					}

					.btn-platinum-submit i {
						margin-right: 6px;
					}

					/* Ajax error text */
					#ajaxMsg {
						color: #dc2626 !important;
						font-size: 13px;
						font-family: 'Inter', sans-serif;
					}

					/* ===== Animation ===== */
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

					/* ===== Responsive ===== */
					@media (max-width: 768px) {
						.reg-card {
							padding: 30px 20px;
							margin: 0 10px;
						}

						.reg-wrapper {
							padding: 20px 10px;
						}
					}
				</style>

				<!-- ajax code -->
				<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
					integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
					crossorigin="anonymous" referrerpolicy="no-referrer"></script>
				<script>
					$(document).ready(function () {
						$("#email").change(function () {
							let userEmail = $(this).val();
							$.ajax({
								url: "/user/register",
								type: "GET",
								data: { "uEmail": userEmail },
								success: function (responseData) {
									if (responseData == "true") {
										$("#ajaxMsg").text("User Email Already Exists, Please take another one");
										setTimeout(function () {
											$("#email").val("");
											$("#ajaxMsg").text("");
										}, 2000);
									}
								}
							})
						})
					})
				</script>
				<script>
					function checkAlpha(event) {
						let data = event.target.value;
						const regEx = /^[a-zA-Z ]*$/;
						if (!regEx.test(data)) {
							event.target.value = data.replace(/[^a-zA-Z ]/g, '');
							Swal.fire({ title: "Format Error", text: "Only Alphabets are allowed", icon: "error" });
						}
					}

					function checkDigit(event) {
						let data = event.target.value;
						if (["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(event.key)) return;

						if (data.length > 10) {
							Swal.fire({ title: "Limit Reached", text: "Only 10 digits allowed", icon: "warning" });
							event.preventDefault();
							return;
						}
						if (!/^[0-9]*$/.test(data + event.key)) {
							Swal.fire({ title: "Format Error", text: "Only Digits are allowed", icon: "error" });
							event.preventDefault();
						}
					}
				</script>
		</head>

		<body>
			<%@include file="/WEB-INF/views/common/nav_bar.html" %>

				<div class="reg-wrapper">
					<div class="reg-card">
						<h2 class="text-center">User Registration</h2>
						<form action="/user/register" method="post" novalidate class="needs-validation"
							enctype="multipart/form-data">

							<div class="form-floating mb-3">
								<input type="text" name="name" placeholder="Enter Name" class="form-control" required
									oninput="checkAlpha(event)">
								<label for="name">Name</label>
								<div class="invalid-feedback">Please Provide Your Name</div>
							</div>

							<div class="form-floating mb-3">
								<input type="text" name="phone" placeholder="Enter Ph-No" class="form-control" required
									onkeydown="checkDigit(event)">
								<label for="phone">Phone-No</label>
								<div class="invalid-feedback">Please Provide Your Phone-No</div>
							</div>

							<div class="form-floating mb-3">
								<input type="email" name="email" id="email" placeholder="Enter Email"
									class="form-control" required>
								<label for="email">Email-ID</label>
								<span id="ajaxMsg"></span>
								<div class="invalid-feedback">Please Provide Your Email</div>
							</div>

							<div class="form-floating mb-3">
								<input type="password" name="password" placeholder="Enter password" class="form-control"
									required>
								<label for="password">Enter Password</label>
								<div class="invalid-feedback">Please Provide Password</div>
							</div>

							<div class="mb-3 form-floating">
								<select name="city" class="form-select" required>
									<option value="" selected disabled>Select City</option>
									<option value="lucknow">Lucknow</option>
									<option value="barabanki">Barabanki</option>
									<option value="sitapur">Sitapur</option>
									<option value="gonda">Gonda</option>
									<option value="hardoi">Hardoi</option>
								</select>
								<div class="invalid-feedback">Please Provide City Name</div>
							</div>

							<div class="form-floating mb-3">
								<textarea class="form-control" placeholder="address" name="address" required></textarea>
								<label for="address">Address</label>
								<div class="invalid-feedback">Please Provide Your Address</div>
							</div>

							<div class="form-floating mb-3">
								<input type="file" name="profilePic" placeholder="Select Photo" class="form-control"
									required>
								<label for="pic">Select Profile Photo</label>
								<div class="invalid-feedback">Please Select Photo</div>
							</div>

							<div class="text-center mb-3">
								<button class="btn-platinum-submit w-100">
									<i class="fas fa-user-plus"></i> Register
								</button>
							</div>

						</form>
					</div>
				</div>

				<%@ include file="/WEB-INF/views/common/footer.html" %>
					<script src="/js/validation.js"></script>
					<script>
<%
							String mess = (String) request.getAttribute("message");
						if (mess != null) {
%>

								let toast = document.createElement('div');
							toast.className = 'toast-platinum';
							toast.innerText = '<%= mess %>';
							document.body.appendChild(toast);

							setTimeout(() => { toast.classList.add('show'); }, 100);

							setTimeout(() => {
								toast.classList.remove('show');
								setTimeout(() => { toast.remove(); }, 700);
							}, 5000);
<%
}
%>
					</script>
					<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
						crossorigin="anonymous"></script>
		</body>

		</html>