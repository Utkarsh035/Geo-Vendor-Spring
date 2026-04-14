import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  TrendingUp, 
  MapPin, 
  Smartphone, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  Zap,
  BarChart3,
  Globe
} from 'lucide-react';
import './PartnerHome.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function PartnerHome() {
  const navigate = useNavigate();

  return (
    <div className="partner-home">
      {/* Hero Section */}
      <section className="partner-hero">
        <div className="partner-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} className="partner-badge">
              <Zap size={14} /> FOR BUSINESS OWNERS
            </motion.div>
            <motion.h1 variants={fadeUp} className="hero-title">
              Grow Your Business with <br />
              <span className="gradient-text">GeoVendor Partner</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-subtitle">
              Connect with thousands of local customers in real-time. 
              Manage your profile, track performance, and stay ahead of the competition.
            </motion.p>
            <motion.div variants={fadeUp} className="hero-btns">
              <button className="btn-primary" onClick={() => navigate('/partner-register')}>
                Get Started Now <ChevronRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/partner-login')}>
                Partner Login
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="partner-features">
        <div className="container">
          <div className="section-header">
            <h2>Why join GeoVendor?</h2>
            <p>Everything you need to manage and scale your local presence.</p>
          </div>
          
          <div className="features-grid">
            {[
              { 
                icon: <MapPin />, 
                title: "Hyper-Local Reach", 
                desc: "Appear to users within a 5km radius the moment they search for your category." 
              },
              { 
                icon: <TrendingUp />, 
                title: "Performance Analytics", 
                desc: "Track views, clicks, and customer engagement through your dedicated dashboard." 
              },
              { 
                icon: <Smartphone />, 
                title: "Live GPS Tracking", 
                desc: "Let customers track your location in real-time, perfect for mobile services and delivery." 
              },
              { 
                icon: <ShieldCheck />, 
                title: "Verified Status", 
                desc: "Build trust with a 'Verified Business' badge after our simple GST verification process." 
              },
              { 
                icon: <BarChart3 />, 
                title: "Growth Insights", 
                desc: "Understand customer behavior and peak times to optimize your business operations." 
              },
              { 
                icon: <Globe />, 
                title: "Digital Presence", 
                desc: "Get a professional business page with photos, contact info, and customer reviews." 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="partner-stats">
        <div className="container">
          <div className="stats-inner">
            {[
              { label: "Active Users", value: "10K+" },
              { label: "Partner Businesses", value: "500+" },
              { label: "Successful Connections", value: "50K+" },
              { label: "Customer Rating", value: "4.8/5" }
            ].map((stat, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="partner-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to put your business on the map?</h2>
            <p>Join hundreds of local businesses already growing with GeoVendor.</p>
            <button className="btn-primary" onClick={() => navigate('/partner-register')}>
              Create Your Partner Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
