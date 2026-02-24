<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@page import="gv.dao.*,gv.beans.*,java.util.*" %>
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <title>Contact List</title>
      <%@include file="/common_html/all_css.html" %>

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
          }

          .hero-title span {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .listing-container {
            max-width: 1200px;
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

          .btn-view {
            background: rgba(37, 99, 235, 0.1);
            color: var(--primary);
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }

          .btn-view:hover {
            background: var(--primary);
            color: white;
          }

          .btn-delete-multi {
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 28px;
            border-radius: 12px;
            font-weight: 700;
            margin-top: 30px;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            transition: all 0.2s ease;
          }

          .btn-delete-multi:hover {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(239, 68, 68, 0.4);
          }

          .modal-content {
            border-radius: 24px;
            border: none;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .modal-header {
            border-bottom: 1px solid #f1f5f9;
            padding: 24px;
          }

          .modal-body {
            padding: 30px;
            color: #475569;
            line-height: 1.6;
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
      <%@include file="/admin/admin_header.html" %>

        <!-- Hero Section -->
        <section class="page-hero">
          <div class="hero-content">
            <h1 class="hero-title">Contact <span>Inquiries</span></h1>
          </div>
          <img alt="pin-img" src="/GeoVendor/images/pin.gif" height="40" width="50" class="pin-img">
        </section>

        <div class="listing-container">
          <% AdminDao dao=new AdminDao(); ArrayList<Contact>contactList=dao.viewAllContacts();
            if(contactList.size()>0){ %>
            <form method="post" action="/GeoVendor/DeleteContact">
              <div class="listing-card">
                <table class="table custom-table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" style="width: 50px;">Sel</th>
                      <th scope="col" style="width: 70px;">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Message</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <% for(Contact c:contactList){ %>
                      <tr>
                        <td>
                          <div class="form-check">
                            <input type="checkbox" name="chk" class="form-check-input" value="<%=c.getId()%>">
                          </div>
                        </td>
                        <td style="font-weight: 700; color: #94a3b8;">#<%=c.getId() %>
                        </td>
                        <td style="font-weight: 600; color: #0f172a;">
                          <%=c.getName() %>
                        </td>
                        <td>
                          <%=c.getEmail() %>
                        </td>
                        <td>
                          <%=c.getPhone()%>
                        </td>
                        <td>
                          <button type="button" class="btn-view" data-bs-toggle="modal"
                            data-bs-target="#exampleModal<%=c.getId()%>">
                            <i class="fas fa-envelope-open-text me-1"></i> View
                          </button>
                        </td>
                        <td>
                          <%=c.getDate() %>
                        </td>
                      </tr>
                      <%} %>
                  </tbody>
                </table>
              </div>

              <!-- Modals placed outside the table for better Bootstrap compatibility -->
              <% for(Contact c:contactList){ %>
                <div class="modal fade" id="exampleModal<%=c.getId()%>" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" style="font-weight: 800; color: #0f172a;">
                          Inquiry from <%=c.getName() %>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; color: #1e293b;">
                          <%=c.getQurey() %>
                        </div>
                      </div>
                      <div class="modal-footer" style="border-top: none; padding: 0 24px 24px;">
                        <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal"
                          style="border-radius: 12px; padding: 10px; font-weight: 600; background: #94a3b8; border: none;">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
                <%} %>

                  <div class="text-center">
                    <button class="btn btn-delete-multi" id="btndelete" type="button">
                      <i class="fas fa-trash-alt me-2"></i> Delete Selected
                    </button>
                  </div>
            </form>
            <%} else{%>
              <div class="listing-card p-5 text-center">
                <i class="fas fa-comment-slash mb-3" style="font-size: 3rem; color: #cbd5e1;"></i>
                <h3 style="color: #64748b;">No Inquiries Found</h3>
              </div>
              <%} %>
        </div>

        <script>
          let flag = 0;
          let btn = document.getElementById("btndelete")
          btn.addEventListener("click", function (event) {


            event.preventDefault()//perventing from form submission
            //alert("hello")
            let checkBoxArray = document.getElementsByName("chk");


            for (let i = 0; i < checkBoxArray.length; i++) {
              if (checkBoxArray[i].checked == true) {
                flag = 1;
                break;
              }
            }//for close
            if (flag == 1) {
              document.forms[0].submit()
            }
            else {
              alert("Pls Select atleast one checkbox")
            }


          })//event listener closed
        </script>


        <%@ include file="/WEB-INF/common/footer.html" %>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"></script>
    </body>

    </html>