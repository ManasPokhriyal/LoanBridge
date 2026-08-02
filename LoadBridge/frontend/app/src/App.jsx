import { useState } from 'react'
import ChatbotWidget from './features/customer/ChatbotWidget'
import './App.css'

function App() {
  const [amount, setAmount] = useState(1000000)
  const [interest, setInterest] = useState(8.5)
  const [tenureYears, setTenureYears] = useState(15)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('Home Loan')

  // EMI Math Calculation
  const r = (interest / 12) / 100
  const n = tenureYears * 12
  const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
  const totalPayable = emi * n
  const totalInterest = totalPayable - amount

  const openApplyModal = (prodName) => {
    setSelectedProduct(prodName || 'Loan Application')
    setIsApplyModalOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header Navbar */}
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🏦</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, tracking: '-0.5px' }}>LoanBridge</h1>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Smart Financial Portal</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#products">Loan Products</a>
          <a href="#calculator">EMI Calculator</a>
          <a href="#portal">Customer Dashboard</a>
          <a href="#support">Support & FAQs</a>
          <button className="cta-btn" onClick={() => openApplyModal('General Loan')}>Apply Now ➔</button>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <span className="badge" style={{ marginBottom: '16px' }}>✨ Powered by AI & Real-time Database</span>
        <h1 className="hero-title">Instant Loans with Intelligent AI Assistance</h1>
        <p className="hero-subtitle">
          Compare loan interest rates, calculate EMIs in real-time, track active loans, and get 24/7 instant answers from our AI Chatbot.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="cta-btn" style={{ padding: '14px 28px', fontSize: '16px' }} onClick={() => openApplyModal('Instant Loan')}>
            ⚡ Apply for Instant Loan
          </button>
          <a href="#calculator" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 28px', borderRadius: '20px', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>
            🧮 Try EMI Calculator
          </a>
        </div>

        {/* Hero Stats Cards */}
        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <div className="hero-stat-number">8.5%</div>
            <div className="hero-stat-label">Lowest Interest Rates</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">24 Hours</div>
            <div className="hero-stat-label">Fast Loan Disbursal</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">0%</div>
            <div className="hero-stat-label">Zero Hidden Charges</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-number">10,000+</div>
            <div className="hero-stat-label">Happy Customers</div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1140px', margin: '48px auto', padding: '0 20px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* 3. Loan Products Section */}
        <section id="products" style={{ marginBottom: '64px' }}>
          <div className="section-header">
            <h2 className="section-title">Explore Loan Products</h2>
            <p className="section-desc">Tailored financial solutions designed to meet your every need with competitive interest rates.</p>
          </div>

          <div className="products-grid">
            <div className="product-card">
              <div>
                <span className="badge">Popular</span>
                <h3 style={{ fontSize: '20px', marginTop: '12px', marginBottom: '8px' }}>🏡 Home Loan</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Build your dream home with low monthly EMIs and tenure up to 30 years.</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>8.5% <span style={{ fontSize: '13px', color: '#64748b' }}>p.a. onwards</span></div>
                <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '18px', margin: '0 0 20px 0' }}>
                  <li>Max Amount: Up to ₹1 Crore</li>
                  <li>Tenure: 12 - 360 Months</li>
                  <li>Min Credit Score: 700</li>
                </ul>
              </div>
              <button className="cta-btn" onClick={() => openApplyModal('Home Loan')}>Apply for Home Loan</button>
            </div>

            <div className="product-card">
              <div>
                <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>Quick Approval</span>
                <h3 style={{ fontSize: '20px', marginTop: '12px', marginBottom: '8px' }}>💼 Personal Loan</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Instant collateral-free funds for emergency expenses, travel, or weddings.</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>11.5% <span style={{ fontSize: '13px', color: '#64748b' }}>p.a. onwards</span></div>
                <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '18px', margin: '0 0 20px 0' }}>
                  <li>Max Amount: Up to ₹15 Lakhs</li>
                  <li>Tenure: 6 - 60 Months</li>
                  <li>Min Income: ₹25,000 / month</li>
                </ul>
              </div>
              <button className="cta-btn" onClick={() => openApplyModal('Personal Loan')}>Apply for Personal Loan</button>
            </div>

            <div className="product-card">
              <div>
                <span className="badge" style={{ background: '#dcfce7', color: '#15803d' }}>Low EMI</span>
                <h3 style={{ fontSize: '20px', marginTop: '12px', marginBottom: '8px' }}>🚗 Car / Auto Loan</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Drive your dream vehicle with 90% on-road funding and minimal paper work.</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>9.25% <span style={{ fontSize: '13px', color: '#64748b' }}>p.a. onwards</span></div>
                <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '18px', margin: '0 0 20px 0' }}>
                  <li>Max Amount: Up to ₹50 Lakhs</li>
                  <li>Tenure: 12 - 84 Months</li>
                  <li>Instant Paperless Disbursal</li>
                </ul>
              </div>
              <button className="cta-btn" onClick={() => openApplyModal('Car Loan')}>Apply for Car Loan</button>
            </div>

            <div className="product-card">
              <div>
                <span className="badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>Student Special</span>
                <h3 style={{ fontSize: '20px', marginTop: '12px', marginBottom: '8px' }}>🎓 Education Loan</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>Empower higher education worldwide with grace period repayment options.</p>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>7.9% <span style={{ fontSize: '13px', color: '#64748b' }}>p.a. onwards</span></div>
                <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '18px', margin: '0 0 20px 0' }}>
                  <li>Max Amount: Up to ₹30 Lakhs</li>
                  <li>Tenure: 12 - 180 Months</li>
                  <li>Co-applicant Supported</li>
                </ul>
              </div>
              <button className="cta-btn" onClick={() => openApplyModal('Education Loan')}>Apply for Education Loan</button>
            </div>
          </div>
        </section>

        {/* 4. Interactive EMI Calculator Section */}
        <section id="calculator" style={{ marginBottom: '64px' }}>
          <div className="section-header">
            <h2 className="section-title">Interactive EMI Calculator</h2>
            <p className="section-desc">Adjust sliders to calculate your monthly EMI and total interest payable instantely.</p>
          </div>

          <div className="calculator-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <div>
              <div className="slider-group">
                <div className="slider-label">
                  <span>Loan Amount</span>
                  <span style={{ color: '#2563eb', fontSize: '16px' }}>₹{amount.toLocaleString()}</span>
                </div>
                <input type="range" className="range-slider" min="100000" max="10000000" step="50000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>Interest Rate (% p.a.)</span>
                  <span style={{ color: '#2563eb', fontSize: '16px' }}>{interest}%</span>
                </div>
                <input type="range" className="range-slider" min="5" max="20" step="0.25" value={interest} onChange={(e) => setInterest(Number(e.target.value))} />
              </div>

              <div className="slider-group">
                <div className="slider-label">
                  <span>Loan Tenure</span>
                  <span style={{ color: '#2563eb', fontSize: '16px' }}>{tenureYears} Years ({tenureYears * 12} Mos)</span>
                </div>
                <input type="range" className="range-slider" min="1" max="30" step="1" value={tenureYears} onChange={(e) => setTenureYears(Number(e.target.value))} />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly EMI Payment</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#2563eb', margin: '8px 0 16px 0' }}>₹{emi.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 400 }}>/ month</span></div>

              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Principal Amount:</span>
                  <strong style={{ color: '#0f172a' }}>₹{amount.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Total Interest Payable:</span>
                  <strong style={{ color: '#dc2626' }}>₹{totalInterest.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>Total Amount Payable:</span>
                  <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹{totalPayable.toLocaleString()}</strong>
                </div>
              </div>

              <button className="cta-btn" style={{ marginTop: '20px', width: '100%' }} onClick={() => openApplyModal(`Calculated Loan of ₹${amount.toLocaleString()}`)}>
                Apply for this Loan ➔
              </button>
            </div>
          </div>
        </section>

        {/* 5. Customer Dashboard Preview */}
        <section id="portal" style={{ marginBottom: '64px' }}>
          <div className="section-header">
            <h2 className="section-title">Customer Dashboard Portal</h2>
            <p className="section-desc">Track live status of your active loans, upcoming EMIs, and payment receipts.</p>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Active Account: Rahul Sharma (Client ID: C101)</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Credit Score: <strong>760 (Excellent)</strong></span>
              </div>
              <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>● Database Connected</span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '13px' }}>
                  <th style={{ padding: '12px' }}>Loan ID</th>
                  <th style={{ padding: '12px' }}>Product</th>
                  <th style={{ padding: '12px' }}>Principal</th>
                  <th style={{ padding: '12px' }}>Monthly EMI</th>
                  <th style={{ padding: '12px' }}>Remaining Balance</th>
                  <th style={{ padding: '12px' }}>Next Due Date</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>L101</td>
                  <td style={{ padding: '12px' }}>Home Loan</td>
                  <td style={{ padding: '12px' }}>₹25,00,000</td>
                  <td style={{ padding: '12px' }}>₹21,696</td>
                  <td style={{ padding: '12px' }}>₹23,80,000</td>
                  <td style={{ padding: '12px' }}>2026-08-10</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Active</span></td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>L102</td>
                  <td style={{ padding: '12px' }}>Personal Loan</td>
                  <td style={{ padding: '12px' }}>₹3,00,000</td>
                  <td style={{ padding: '12px' }}>₹9,888</td>
                  <td style={{ padding: '12px' }}>₹1,45,000</td>
                  <td style={{ padding: '12px' }}>2026-08-15</td>
                  <td style={{ padding: '12px' }}><span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* 6. Quick Application Modal */}
      {isApplyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsApplyModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Application for {selectedProduct}</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsApplyModalOpen(false)}>×</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert(`Thank you! Your application for ${selectedProduct} has been submitted successfully. Our agent will contact you within 24 hours.`); setIsApplyModalOpen(false); }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                <input type="text" required placeholder="Enter full name" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Mobile Number</label>
                <input type="tel" required placeholder="+91 9876543210" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Monthly Income (₹)</label>
                <input type="number" required placeholder="e.g. 50000" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" className="cta-btn" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Submit Application 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 7. Footer */}
      <footer id="support" className="site-footer">
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '18px' }}>🏦 LoanBridge Systems</h4>
            <p style={{ margin: 0, color: '#64748b' }}>RBI Registered Digital Lending Platform & AI Customer Support</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#cbd5e1' }}>📞 Helpline: 1800-123-5626 (Toll Free)</p>
            <p style={{ margin: 0, color: '#cbd5e1' }}>📧 Support: support@loanbridge.com</p>
          </div>
        </div>
        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', color: '#475569', fontSize: '12px' }}>
          © 2026 LoanBridge Systems Ltd. All Rights Reserved. Powered by AI Chatbot Technology.
        </div>
      </footer>

      {/* 8. Floating AI Chatbot Widget */}
      <ChatbotWidget clientId="C101" />
    </div>
  )
}

export default App
