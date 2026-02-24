package gv.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import gv.beans.Business;
import gv.beans.Feedback;
import gv.beans.User;
import gv.beans.Vendor;
import gv.beans.Vendor_feedback;
import gv.dbutils.DbConnection;

public class VendorDao {
	private Connection con;

	public int vendorRegistration(Vendor v) {
		int status=0;
		con=DbConnection.openConnection();
		
		String strInsert="insert into vendor(email, password, name, phone, city, address, profile_pic)values(?,?,?,?,?,?,?)";
		PreparedStatement ps=null;
		try {
			ps=con.prepareStatement(strInsert);
			ps.setString(1,v.getEmail());
			ps.setString(2,v.getPassword());
			ps.setString(3,v.getName());
			ps.setString(4,v.getPhone());
			ps.setString(5,v.getCity());
			ps.setString(6,v.getAddress());
			ps.setString(7,v.getProfile_pic());
		
			System.out.println(ps);
			status=ps.executeUpdate();
		}
		catch(SQLException se) {
			se.printStackTrace();
		}
		
		finally {
			try {
				if(ps!=null)
					ps.close();
				if(con!=null)
					con.close();
			}
			catch(SQLException se) {
				se.printStackTrace();
			}
		}
		return status;	}

	public boolean checkLogin(String email, String pass) {
		 con=DbConnection.openConnection();
		    PreparedStatement ps=null;
		    ResultSet rs=null;
		    String selectqurey="select *  from vendor where email=? and password=?";
		    
		    try {
		    	ps=con.prepareStatement(selectqurey);
		    	ps.setString(1, email);
		    	ps.setString(2,pass);
		    	System.out.println(ps);
		    	rs=ps.executeQuery();
		    	
		    	if(rs.next()==true) //if shows that email and password exits
		    	{
		    		return true;
		    	}
		    	
		    	
		    }
		    catch(SQLException se){
		    	se.printStackTrace();
		    	
		    }
			return false;
	}
	public Vendor vendorProfile(String emailId) {
		con=DbConnection.openConnection();
		String selectQuery="select * from vendor where email=?";
		PreparedStatement ps=null;
		ResultSet rs=null;
		Vendor v=null;
		
		try {
			ps=con.prepareStatement(selectQuery);
			ps.setString(1,emailId);
			System.out.println(ps);
			rs=ps.executeQuery();
			rs.next();//place the cursor at that row
			//email, password, name, phone, city, address, profile_pic, date
			String vName=rs.getString("name");
			String vPhone=rs.getString("phone");
			String vCity=rs.getString("city");
			String vAddress=rs.getString("address");
			String vPic=rs.getString("profile_pic");
			String vPassword=rs.getString("password");
			v=new Vendor();
			
			v.setEmail(emailId);
			v.setName(vName);
			v.setPhone(vPhone);
			v.setAddress(vAddress);
			v.setCity(vCity);
			v.setProfile_pic(vPic);
			v.setPassword(vPassword);
			
			
		}
		catch(SQLException se) {
			se.printStackTrace();
			
		}
		return v;
	}

	

	public int editProfile(Vendor v, String email) {
		int status=0;
		con=DbConnection.openConnection();
		 PreparedStatement ps=null;
		 try {
			 //email, password, name, phone, city, address, profile_pic, date
			 String updateQuery="update vendor set phone=?,name=?,city=?,address=? where email=? ";
			 ps=con.prepareStatement(updateQuery);
			 ps.setString(1,v.getPhone());
			 ps.setString(2,v.getName());
			 ps.setString(3,v.getCity());
			 ps.setString(4,v.getAddress());
			 ps.setString(5,email);
			 System.out.println(ps);
			 
			 status=ps.executeUpdate();
			 
		 }
		 catch(SQLException se) {
			 se.printStackTrace();
		 }
		
		return status;
	}

	public int addBusiness(String email, Business bs) {
		int status=0;
		con=DbConnection.openConnection();
		PreparedStatement ps= null;
		//email, business_category, business_name, description, location_lat, location_long, phone, address, gst_no
		String addQurey ="insert into business(email,business_category, business_name, description,phone, address, gst_no,business_icon,business_photo)values(?,?,?,?,?,?,?,?,?)";
		try {
			ps=con.prepareStatement(addQurey);
			ps.setString(1, email);
			ps.setString(2, bs.getBusiness_category());
			ps.setString(3, bs.getBusiness_name());
			ps.setString(4, bs.getDescription());
			ps.setString(5, bs.getPhone());
			ps.setString(6, bs.getAddress());
			ps.setString(7, bs.getGst_no());
			ps.setString(8, bs.getBusiness_icon());
			ps.setString(9, bs.getBusiness_photo());
			 System.out.println(ps);
			 
			status=ps.executeUpdate();
			
		}
		catch(SQLException se) {
			se.printStackTrace();
		}
		return status;
	}
	public Business businessProfile(String emailId) {
	    con = DbConnection.openConnection();
	    String selectQuery = "select * from business where email=?";
	    PreparedStatement ps = null;
	    ResultSet rs = null;
	    Business bs = null;

	    try {
	        ps = con.prepareStatement(selectQuery);
	        ps.setString(1, emailId);
	        rs = ps.executeQuery();

	        if (rs.next()) {

	            bs = new Business();   // ✅ Create object FIRST

	            bs.setEmail(emailId);
	            bs.setBusiness_category(rs.getString("business_category"));
	            bs.setBusiness_name(rs.getString("business_name"));
	            bs.setDescription(rs.getString("description"));
	            bs.setPhone(rs.getString("phone"));
	            bs.setAddress(rs.getString("address"));
	            bs.setGst_no(rs.getString("gst_no"));
	            bs.setBusiness_icon(rs.getString("business_icon"));
	            bs.setBusiness_photo(rs.getString("business_photo"));
	            bs.setLocation_lat(rs.getString("location_lat"));
	            bs.setLocation_long(rs.getString("location_long"));
	        }

	    } catch (SQLException se) {
	        se.printStackTrace();
	    }

	    return bs;
	}
	public int editBusiness(Business bs, String email) {
		int status=0;
		con=DbConnection.openConnection();
		 PreparedStatement ps=null;
		 try {
			 //email, business_category, business_name, description, location_lat, location_long, phone, address, gst_no, business_icon
			 String updateQuery="update business set business_name=?,address=?,gst_no=?,phone=? where email=? ";
			 ps=con.prepareStatement(updateQuery);
			 ps.setString(1,bs.getBusiness_name());
			 ps.setString(2,bs.getAddress());
			 ps.setString(3,bs.getGst_no());
			 ps.setString(4,bs.getPhone());
			 ps.setString(5,email);
			 System.out.println(ps);
			 
			 status=ps.executeUpdate();
			 
		 }
		 catch(SQLException se) {
			 se.printStackTrace();
		 }
		
		return status;
	}

	public int addLoaction(Business b,String email) {
		int status=0;
		
		con=DbConnection.openConnection();
		//email, business_category, business_name, description, location_lat, location_long, phone, address, gst_no, business_icon
		
		PreparedStatement ps=null;
		ResultSet rs=null;
		try {
			String updateQurey="update business set location_lat=?,location_long=? where email=?";
			ps=con.prepareStatement(updateQurey);
			ps.setString(1,b.getLocation_lat());
			ps.setString(2,b.getLocation_long());
			ps.setString(3,email);
			
			status=ps.executeUpdate();
			
			
		}
		catch(SQLException se) {
			se.printStackTrace();
			
		}
		return status;
		
	}
	
	
//method to check email
	public boolean checkEmail(String email) {
		String strsql="select email from vendor_feedback where email=?";
		con=DbConnection.openConnection();
		PreparedStatement ps=null;
		ResultSet rs=null;
		try {
			ps=con.prepareStatement(strsql);
			ps.setString(1, email);
			rs=ps.executeQuery();
			if(rs.next()) {
				return true;
			}
			
		}
		catch(SQLException se) {
			se.printStackTrace();
		}
		
		return false;
	}
	

	public int addvendorFeedback(Vendor_feedback vf) {
		con=DbConnection.openConnection();//connection established with geo_db
		int status=0;
		PreparedStatement ps=null;
		
		try {
			//check for email existence
			String query="";
			if(checkEmail(vf.getEmaill())==false) {
				//id, name, email, rating, remark, date
			query="insert into vendor_feedback( name, email, rating, remark, date)values(?,?,?,?,?)";
			ps=con.prepareStatement(query);
			ps.setString(1,vf.getName());
			ps.setString(2, vf.getEmaill());
			ps.setString(3, vf.getRating());
			ps.setString(4, vf.getRemark());
			ps.setDate(5,vf.getDate());
			System.out.println(ps);
			status=ps.executeUpdate();
			System.out.println("qurey status is:- "+status);
			}
			else {
				
				query="update vendor_feedback set rating=?, remark=?, date=? where emaill=?";
				con=DbConnection.openConnection();
				ps=con.prepareStatement(query);
				ps.setString(1, vf.getRating());
				ps.setString(2, vf.getRemark());
				ps.setDate(3,vf.getDate());
				ps.setString(4,vf.getEmaill());
				
				System.out.println(ps);
				status=ps.executeUpdate();
				System.out.println("qurey status is:- "+status);
			}
			
			//String strInsert="insert into feedback( name, emaill, rating, remark, date)values(?,?,?,?,?)";
			
		}
		catch(SQLException se) {
			se.printStackTrace();
		}
		
		return status;
	}
	public ArrayList<Vendor> allFeedback(){
		con=DbConnection.openConnection();
		//id, name, emaill, rating, remark, date
		//email, password, name, phone, city, address, profile_pic, date
		String sql = "SELECT vf.name, vf.rating, vf.remark, v.profile_pic FROM vendor_feedback vf, vendor v WHERE v.email = vf.email AND vf.rating = 'fas fa-star,fas fa-star,fas fa-star,fas fa-star,fas fa-star' ORDER BY vf.date DESC LIMIT 5";


		//
		 Vendor v=null;
		 Vendor_feedback vfeed=null;
		 
		 PreparedStatement ps=null;
		 ResultSet rs=null;
		 ArrayList<Vendor>vendorList=new ArrayList<>();
		 try {
			 ps=con.prepareStatement(sql);
			 rs=ps.executeQuery();
			 while(rs.next()) 
			 {
				String uName=rs.getString("name");
				String uRating=rs.getString("rating");
				String uRemark=rs.getString("remark");
				String uPic=rs.getString("profile_pic");
				//creating object of feedback beans
				vfeed=new  Vendor_feedback();
				vfeed.setName(uName);
				vfeed.setRating(uRating);
				vfeed.setRemark(uRemark);
				//creating object of user beans
				v=new Vendor();
				v.setProfile_pic(uPic);
				v.setVf(vfeed);//HAS-A Realtionship concept
				//adding user class object in arraylist
				vendorList.add(v);
			 }
			 
		 }
		 catch(SQLException se) {
			 se.printStackTrace();
			 //finally{}
		 }
		 return vendorList;
	}

	public int updateLoaction(Business b, String email) {
int status=0;
		
		con=DbConnection.openConnection();
		//email, business_category, business_name, description, location_lat, location_long, phone, address, gst_no, business_icon
		
		PreparedStatement ps=null;
		ResultSet rs=null;
		try {
			String updateQurey="update business set location_lat=?,location_long=? where email=?";
			ps=con.prepareStatement(updateQurey);
			ps.setString(1,b.getLocation_lat());
			ps.setString(2,b.getLocation_long());
			ps.setString(3,email);
			
			status=ps.executeUpdate();
			
			
		}
		catch(SQLException se) {
			se.printStackTrace();
			
		}
		return status;
	}

	//

}
