package gv.vendor.servlets;

import java.io.File;
import java.io.IOException;
import java.util.TreeMap;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import gv.beans.Business;
import gv.dao.VendorDao;

/**
 * Servlet implementation class Business_Details
 */
@WebServlet("/Business_Details")
@MultipartConfig
public class Business_Details extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Business_Details() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		TreeMap<String,String>iconMap=new TreeMap<>();
		
		iconMap.put("shop", "fas fa-store");
		iconMap.put("school", "fas fa-school");
		iconMap.put("hospital", "fas fa-hospital");
		iconMap.put("hotel", "fas fa-hotel");
		iconMap.put("restaurant", "fas fa-utensils");
		iconMap.put("private_office", "fas fa-building");
		iconMap.put("other", "fas fa-map-marker-alt");
		
		
		
		String bname=request.getParameter("name");
		String bcategory=request.getParameter("category");
		String bdescription=request.getParameter("description");
		String bphone=request.getParameter("phone");
		String baddress=request.getParameter("address");
		String bgst=request.getParameter("gst");
		String bphoto=request.getParameter("business_photo");
		
		
		
		HttpSession hs = request.getSession(false);
		if(hs == null){
		    response.sendRedirect("/GeoVendor/vendor/vendor_login.jsp");
		    return;
		}
		String email = (String) hs.getAttribute("sessionEmail");
		
		
		 //fetching uploaded file data
		 Part p=request.getPart("business_photo");
		 String fileName=p.getSubmittedFileName();
		 long size=p.getSize();//in bytes
		 
		 System.out.println("File name:- "+fileName+" and size:- "+size);
		 ServletContext sc= getServletContext();// sc will give refernce of existing context
		 String serverPath=sc.getRealPath("");//return the path were website is hosted on server
		 System.out.println("path is "+serverPath);
		 String folderName="vendorImages";
		 String fullPath=serverPath+folderName;
		 
		 
		 File f= new File(fullPath);
		 String picPath="";
		 String dbPath="";//stores the img path for database table
		 if(!f.exists()) {
			 f.mkdir();//for creating directory(folder) on the path
			 System.out.println("Directory created");
		 }
		 
			 picPath=fullPath+File.separator+fileName;
			 dbPath=folderName+File.separator+fileName;
			 p.write(picPath);
			 
			 //date convertion
			 java.util.Date d=new java.util.Date();
				System.out.println(d);//java date
				long dt=d.getTime();//
				java.sql.Date sqldate=new java.sql.Date(dt);//conversion of util date to sql date
				System.out.println("sql date:- "+sqldate);
		
		System.out.println(bname+bcategory+bdescription+bphone+baddress+bgst+email+bphoto);
		
		
		
		
		Business bs = new Business(email, bcategory, bname, bdescription, bphone, baddress, bgst);
		bs.setBusiness_photo(dbPath);
	
		System.out.println(iconMap.get(bcategory));
		bs.setBusiness_icon(iconMap.get(bcategory));
		
		
		VendorDao dao=new VendorDao();
		
		int status=dao.addBusiness(email,bs);
		if(status>0) {
		    response.sendRedirect("/GeoVendor/vendor/add_location.jsp");
		} else {
		    response.getWriter().println("Insert Failed!");
		}
		
	}

}
