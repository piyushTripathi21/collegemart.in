import React from 'react'
import { useParams } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import DOMPurify from 'dompurify'

const blogPosts = {
  '1': {
    title: 'Complete Guide to Buying Used Engineering Books: Save Up to 70% This Semester',
    date: 'March 17, 2026',
    image: '/static-assets/h1.png',
    content: `
      <h2>Why Buy Used Engineering Books?</h2>
      <p>Engineering textbooks can be extremely expensive, often costing ₹500 to ₹2000 per book. Buying used books on CollegeMart can help you save up to 70% on your textbook expenses. Here's a comprehensive guide to help you make smart purchases.</p>
      
      <h3>Benefits of Buying Used Engineering Books</h3>
      <ul>
        <li>Save significant money on expensive textbooks</li>
        <li>Reduce waste and support sustainability</li>
        <li>Find books from seniors who have already studied them</li>
        <li>Access hard-to-find older editions</li>
        <li>Connect with other students in your college</li>
      </ul>
      
      <h3>Tips for Finding Quality Used Books</h3>
      <ol>
        <li><strong>Check the Book Condition:</strong> Always ask sellers about the condition. Look for books with minimal highlighting and intact binding.</li>
        <li><strong>Verify the Edition:</strong> Make sure the book edition matches your course requirements as newer editions may have different content.</li>
        <li><strong>Compare Prices:</strong> Check multiple sellers on CollegeMart to find the best deal.</li>
        <li><strong>Read Seller Reviews:</strong> Buy from sellers with good ratings and positive feedback.</li>
        <li><strong>Meet in Safe Locations:</strong> Always meet sellers in public places on campus or nearby.</li>
        <li><strong>Inspect Before Payment:</strong> Thoroughly check the book before handing over money.</li>
      </ol>
      
      <h3>Popular Engineering Books You Can Find</h3>
      <p>On CollegeMart, you can find used copies of popular engineering textbooks including:</p>
      <ul>
        <li>GATE preparation books</li>
        <li>Mathematics (Calculus, Linear Algebra, Differential Equations)</li>
        <li>Physics and Chemistry textbooks</li>
        <li>Programming and Data Structure books</li>
        <li>Circuit Theory and Electronics</li>
        <li>Fluid Mechanics and Thermodynamics</li>
      </ul>
      
      <h3>How to Sell Your Books After Semester</h3>
      <p>Once you've finished studying, don't let your books gather dust! Sell them on CollegeMart to help other students and earn some money back. Take clear photos, describe the condition honestly, and set a competitive price.</p>
    `
  },
  '2': {
    title: 'Best Budget Laptops for Engineering Students in 2026 Under ₹50,000',
    date: 'March 17, 2026',
    image: '/static-assets/h2.png',
    content: `
      <h2>Finding the Perfect Laptop for Engineering Studies</h2>
      <p>As an engineering student, you need a laptop that can handle coding, simulations, and design software. But you don't need to spend a fortune! Here are the best budget laptops under ₹50,000 available on CollegeMart.</p>
      
      <h3>What Specs Do Engineering Students Need?</h3>
      <ul>
        <li><strong>Processor:</strong> At least Intel i5 or equivalent</li>
        <li><strong>RAM:</strong> 8GB minimum (16GB preferred)</li>
        <li><strong>Storage:</strong> 512GB SSD for faster performance</li>
        <li><strong>Display:</strong> 15.6 inches with good color accuracy</li>
        <li><strong>Graphics:</strong> Dedicated GPU for CAD and simulations</li>
      </ul>
      
      <h3>Best Budget Laptops for Engineering</h3>
      <ol>
        <li><strong>Dell Inspiron 15 (Intel i5):</strong> Great for general programming and coursework</li>
        <li><strong>HP Pavilion 15:</strong> Good balance of performance and price</li>
        <li><strong>Lenovo ThinkBook 15:</strong> Reliable for professional use and studies</li>
        <li><strong>ASUS VivoBook 15:</strong> Lightweight with decent performance</li>
        <li><strong>Used MacBook Air (Older Models):</strong> Often available under ₹50,000 on CollegeMart</li>
      </ol>
      
      <h3>Tips for Buying Used Laptops on CollegeMart</h3>
      <ul>
        <li>Check battery health and backup battery information</li>
        <li>Ask for service history and warranty remaining</li>
        <li>Test the keyboard, trackpad, and display carefully</li>
        <li>Run system diagnostics to check hardware health</li>
        <li>Verify that the charger and all accessories are included</li>
        <li>Ask about return/exchange policy before purchase</li>
      </ul>
      
      <h3>Software You'll Need</h3>
      <p>Most engineering colleges provide free or discounted licenses for essential software like:</p>
      <ul>
        <li>MATLAB</li>
        <li>AutoCAD</li>
        <li>Visual Studio</li>
        <li>Office Suite</li>
        <li>Linux/Ubuntu (free)</li>
      </ul>
    `
  },
  '3': {
    title: 'Hostel Room Essentials Checklist: Everything You Need for College',
    date: 'March 6, 2026',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Complete Hostel Room Essentials Guide</h2>
      <p>Moving into a hostel can be exciting! To make your room comfortable and functional, here's a complete checklist of essentials you should have. Many of these items are available at great prices on CollegeMart!</p>
      
      <h3>Bedding and Sleep</h3>
      <ul>
        <li>Single bed sheets (2-3 sets)</li>
        <li>Pillow and pillowcase</li>
        <li>Blanket or comforter (check hostel climate)</li>
        <li>Mattress protector</li>
      </ul>
      
      <h3>Clothing Storage</h3>
      <ul>
        <li>Wardrobe or cloth rack (if space permits)</li>
        <li>Hangers</li>
        <li>Undergarment organizer</li>
        <li>Shoe rack</li>
        <li>Laundry bag</li>
      </ul>
      
      <h3>Study Area</h3>
      <ul>
        <li>Desk lamp with good lighting</li>
        <li>Study table or desk (if allowed)</li>
        <li>Chair or stool</li>
        <li>Bookshelf or storage cubes</li>
        <li>Desk organizer</li>
      </ul>
      
      <h3>Personal Hygiene</h3>
      <ul>
        <li>Towels (2-3)</li>
        <li>Bath mat</li>
        <li>Shower slippers</li>
        <li>Toiletry bag</li>
        <li>Mirror</li>
      </ul>
      
      <h3>Electronics</h3>
      <ul>
        <li>Mobile phone charger</li>
        <li>Power bank</li>
        <li>Laptop and charger</li>
        <li>Headphones or earbuds</li>
        <li>Extension cords/power strips</li>
      </ul>
      
      <h3>Miscellaneous</h3>
      <ul>
        <li>First aid kit</li>
        <li>Flashlight</li>
        <li>Umbrella/raincoat</li>
        <li>Locks for lockers</li>
        <li>Stationery and notebooks</li>
      </ul>
      
      <h3>Money-Saving Tips</h3>
      <p>Buy used items on CollegeMart to save money. Many senior students sell their hostel essentials at great discounts when they graduate!</p>
    `
  },
  '4': {
    title: 'How to Sell Your Used Books and Electronics on CollegeMart',
    date: 'February 23, 2026',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Sell Used Books and Electronics with Confidence</h2>
      <p>CollegeMart makes it easy to list your used textbooks, gadgets, and accessories. Follow these tips to sell faster and get the best price from fellow students.</p>
      <h3>Take Great Photos</h3>
      <p>Clear images build trust. Photograph items from multiple angles and highlight condition details such as wear, stickers, or missing parts.</p>
      <h3>Write Honest Descriptions</h3>
      <p>Include accurate details: edition, model, condition, and any included accessories. Mention if the item is open-box, refurbished, or gently used.</p>
      <h3>Set a Fair Price</h3>
      <p>Compare similar listings on CollegeMart and price competitively. Consider offering bundle discounts for multiple items.</p>
      <h3>Communicate Quickly</h3>
      <p>Respond to buyers politely and promptly. Good communication helps close sales faster.</p>
      <h3>Meet Safely</h3>
      <p>Choose public campus spots, bring a friend if possible, and verify payment before handing over the item.</p>
    `
  },
  '5': {
    title: 'Budget Shopping Guide: Best Deals on Study Materials This Season',
    date: 'February 22, 2026',
    image: 'https://images.unsplash.com/photo-1524634126442-357ae0eaf6f8?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Score the Best Study Material Deals This Season</h2>
      <p>CollegeMart is the perfect place to find affordable books, stationery, and study accessories. Learn how to shop smart and make the most of seasonal discounts.</p>
      <h3>Compare Prices</h3>
      <p>Check multiple listings for the same product. Small savings add up fast during semester startups.</p>
      <h3>Look for Bundles</h3>
      <p>Sellers often bundle textbooks, stationery, and lab supplies. Bundles can save more than buying items one by one.</p>
      <h3>Buy in Advance</h3>
      <p>Shop early for popular textbooks and exam prep guides before demand drives prices up.</p>
      <h3>Use Filters</h3>
      <p>Filter by college, department, or condition to find the best match quickly.</p>
    `
  },
  '6': {
    title: 'Best Affordable Cycles for College Campus Travel',
    date: 'March 1, 2026',
    image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Top Affordable Cycles for Campus Travel</h2>
      <p>Explore the best bicycles for college students that balance comfort, durability, and price. CollegeMart connects you with sellers offering great campus-ready bikes.</p>
      <h3>What to Look For</h3>
      <ul>
        <li>Lightweight frame</li>
        <li>Responsive brakes</li>
        <li>Comfortable saddle</li>
        <li>Easy gear shifting</li>
      </ul>
      <h3>Recommended Options</h3>
      <p>Search for hybrid and commuter models that are easy to maintain and ideal for short city rides.</p>
    `
  },
  '7': {
    title: 'Smart Shopping Tips: How to Get Maximum Value from Your College Budget',
    date: 'March 6, 2026',
    image: 'https://images.unsplash.com/photo-1515169067869-5387ec356754?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Get More Value from Your College Budget</h2>
      <p>Use CollegeMart to stretch your budget further with smart buying habits and money-saving strategies.</p>
      <h3>Shop Used First</h3>
      <p>Second-hand textbooks and electronics often cost far less than new versions.</p>
      <h3>Negotiate Respectfully</h3>
      <p>Ask sellers if they can offer a small discount, especially for bundled items.</p>
      <h3>Follow Price Trends</h3>
      <p>Track prices over a few days to identify the best time to buy.</p>
    `
  },
  '8': {
    title: 'Hostel Furniture Hacks: Maximize Your Dorm Space Smartly',
    date: 'May 17, 2026',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Smart Hostel Furniture Hacks</h2>
      <p>Make the most of limited dorm space with clever furniture choices and storage hacks.</p>
      <h3>Choose Multi-Use Pieces</h3>
      <ul>
        <li>Foldable tables</li>
        <li>Stackable storage boxes</li>
        <li>Under-bed organizers</li>
      </ul>
      <h3>Keep It Light</h3>
      <p>Pick portable furniture that is easy to move and store.</p>
    `
  },
  '9': {
    title: 'Best Smartphones Under ₹20,000 for Students in 2026',
    date: 'March 2, 2026',
    image: 'https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Top Student Smartphones Under ₹20,000</h2>
      <p>Find reliable phones with good battery life, performance, and value for your student budget.</p>
      <h3>Must-Have Features</h3>
      <ul>
        <li>Strong battery</li>
        <li>Good camera</li>
        <li>Fast processor</li>
      </ul>
    `
  },
  '10': {
    title: 'How to Buy Second-Hand Electronics Safely on CollegeMart',
    date: 'January 15, 2026',
    image: 'https://images.unsplash.com/photo-1518444025592-65c2fab81e5e?auto=format&fit=crop&w=900&q=80',
    content: `
      <h2>Buying Second-Hand Electronics Safely</h2>
      <p>Learn how to choose trusted sellers and inspect devices before purchase on CollegeMart.</p>
      <h3>Inspect Before You Buy</h3>
      <ul>
        <li>Check the power and charging port</li>
        <li>Test the screen and buttons</li>
        <li>Verify battery health</li>
      </ul>
    `
  }
}

import { useTheme } from '../context/ThemeContext'
import { getThemeStyles } from '../utils/themeStyles'

export default function BlogPostDetail({ user, onOpenLogin }) {
  const { postId } = useParams()
  const post = blogPosts[postId]
  const { theme } = useTheme()
  const t = getThemeStyles(theme)
  const isDark = theme === 'dark'

  if (!post) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'inherit',
        transition: 'background 0.3s ease, color 0.3s ease'
      }}>
        {}
        <div style={{
          position: 'absolute', top: '100px', right: '-150px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
          pointerEvents: 'none',
          filter: 'blur(100px)',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar user={user} onOpenLogin={onOpenLogin} />
          <main style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
            <h1 style={{ color: t.textPrimary, fontSize: '28px', fontWeight: 700 }}>Post Not Found</h1>
            <p style={{ color: t.textMuted }}>The blog post you're looking for doesn't exist.</p>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'inherit',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {}
      <div style={{
        position: 'absolute', top: '100px', right: '-150px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: isDark ? 'rgba(35,229,219,0.03)' : 'rgba(14,165,233,0.05)',
        pointerEvents: 'none',
        filter: 'blur(100px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '800px', left: '-200px',
        width: '700px', height: '700px', borderRadius: '50%',
        background: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.05)',
        pointerEvents: 'none',
        filter: 'blur(120px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar user={user} onOpenLogin={onOpenLogin} />
        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          <article style={{
            background: t.cardBgAlt,
            border: `1px solid ${t.border}`,
            borderRadius: '18px',
            overflow: 'hidden',
            padding: '40px'
          }}>
            <img 
              src={post.image} 
              alt={post.title} 
              style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '32px' }} 
            />
            <div style={{ marginBottom: '24px', color: t.accentText, fontSize: '14px', fontWeight: '600' }}>
              {post.date}
            </div>
            <h1 style={{ fontSize: '36px', color: t.textPrimary, marginBottom: '24px', lineHeight: '1.4', fontWeight: 700 }}>
              {post.title}
            </h1>
            <div 
              className="blog-content-rendered"
              style={{ fontSize: '16px', lineHeight: '1.8', color: t.textSecondary }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
          </article>
        </main>
        <Footer />
      </div>
    </div>
  )
}
