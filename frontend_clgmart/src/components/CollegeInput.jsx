import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COLLEGES = [
  {"name":"Indian Institute of Technology Delhi","state":"Delhi","short":"IIT Delhi"},
  {"name":"University of Delhi","state":"Delhi","short":"DU Delhi"},
  {"name":"Jawaharlal Nehru University","state":"Delhi","short":"JNU Delhi"},
  {"name":"Jamia Millia Islamia","state":"Delhi","short":"Jamia Delhi"},
  {"name":"Indraprastha University","state":"Delhi","short":"IPU Delhi"},
  {"name":"Delhi Technological University","state":"Delhi","short":"DTU Delhi"},
  {"name":"Netaji Subhas University of Technology","state":"Delhi","short":"NSUT Delhi"},
  {"name":"Lady Shri Ram College","state":"Delhi","short":"LSR Delhi"},
  {"name":"Miranda House","state":"Delhi","short":"Miranda House Delhi"},
  {"name":"St. Stephen's College","state":"Delhi","short":"St. Stephens Delhi"},
  {"name":"Hansraj College","state":"Delhi","short":"Hansraj College Delhi"},
  {"name":"Kirori Mal College","state":"Delhi","short":"KMC Delhi"},
  {"name":"NLU Delhi","state":"Delhi","short":"NLU Delhi"},
  {"name":"Indian Institute of Technology Bombay","state":"Maharashtra","short":"IIT Bombay"},
  {"name":"University of Mumbai","state":"Maharashtra","short":"Mumbai University"},
  {"name":"Savitribai Phule Pune University","state":"Maharashtra","short":"SPPU Pune"},
  {"name":"College of Engineering Pune","state":"Maharashtra","short":"COEP Pune"},
  {"name":"Symbiosis International University","state":"Maharashtra","short":"Symbiosis Pune"},
  {"name":"MIT World Peace University","state":"Maharashtra","short":"MIT WPU Pune"},
  {"name":"Veermata Jijabai Technological Institute","state":"Maharashtra","short":"VJTI Mumbai"},
  {"name":"Institute of Chemical Technology","state":"Maharashtra","short":"ICT Mumbai"},
  {"name":"Narsee Monjee Institute of Management","state":"Maharashtra","short":"NMIMS Mumbai"},
  {"name":"SP Jain Institute of Management","state":"Maharashtra","short":"SP Jain Mumbai"},
  {"name":"Fergusson College","state":"Maharashtra","short":"Fergusson College Pune"},
  {"name":"Nagpur University","state":"Maharashtra","short":"RTMNU Nagpur"},
  {"name":"Symbiosis Law School","state":"Maharashtra","short":"SLS Pune"},
  {"name":"Homi Bhabha National Institute","state":"Maharashtra","short":"HBNI Mumbai"},
  {"name":"TIFR Mumbai","state":"Maharashtra","short":"TIFR Mumbai"},
  {"name":"Indian Institute of Technology Madras","state":"Tamil Nadu","short":"IIT Madras"},
  {"name":"Anna University","state":"Tamil Nadu","short":"Anna University Chennai"},
  {"name":"VIT University Vellore","state":"Tamil Nadu","short":"VIT Vellore"},
  {"name":"SRM Institute of Science and Technology","state":"Tamil Nadu","short":"SRM Chennai"},
  {"name":"PSG College of Technology","state":"Tamil Nadu","short":"PSG Coimbatore"},
  {"name":"Coimbatore Institute of Technology","state":"Tamil Nadu","short":"CIT Coimbatore"},
  {"name":"Madras Christian College","state":"Tamil Nadu","short":"MCC Chennai"},
  {"name":"Loyola College Chennai","state":"Tamil Nadu","short":"Loyola Chennai"},
  {"name":"National Institute of Technology Trichy","state":"Tamil Nadu","short":"NIT Trichy"},
  {"name":"VIT Chennai","state":"Tamil Nadu","short":"VIT Chennai"},
  {"name":"Sathyabama Institute of Science and Technology","state":"Tamil Nadu","short":"Sathyabama Chennai"},
  {"name":"SASTRA University","state":"Tamil Nadu","short":"SASTRA Thanjavur"},
  {"name":"Bharathiar University","state":"Tamil Nadu","short":"Bharathiar Coimbatore"},
  {"name":"Madurai Kamaraj University","state":"Tamil Nadu","short":"MKU Madurai"},
  {"name":"Karpagam Academy","state":"Tamil Nadu","short":"Karpagam Coimbatore"},
  {"name":"Indian Institute of Technology Kharagpur","state":"West Bengal","short":"IIT Kharagpur"},
  {"name":"Jadavpur University","state":"West Bengal","short":"Jadavpur University Kolkata"},
  {"name":"University of Calcutta","state":"West Bengal","short":"Calcutta University"},
  {"name":"Presidency University Kolkata","state":"West Bengal","short":"Presidency University Kolkata"},
  {"name":"Indian Statistical Institute","state":"West Bengal","short":"ISI Kolkata"},
  {"name":"St. Xavier's College Kolkata","state":"West Bengal","short":"St. Xaviers Kolkata"},
  {"name":"NIT Durgapur","state":"West Bengal","short":"NIT Durgapur"},
  {"name":"Heritage Institute of Technology","state":"West Bengal","short":"Heritage Institute Kolkata"},
  {"name":"Techno India University","state":"West Bengal","short":"Techno India Kolkata"},
  {"name":"Indian Institute of Technology Kanpur","state":"Uttar Pradesh","short":"IIT Kanpur"},
  {"name":"Indian Institute of Technology BHU","state":"Uttar Pradesh","short":"IIT BHU Varanasi"},
  {"name":"Aligarh Muslim University","state":"Uttar Pradesh","short":"AMU Aligarh"},
  {"name":"Banaras Hindu University","state":"Uttar Pradesh","short":"BHU Varanasi"},
  {"name":"University of Allahabad","state":"Uttar Pradesh","short":"Allahabad University"},
  {"name":"Amity University Noida","state":"Uttar Pradesh","short":"Amity University Noida"},
  {"name":"Lucknow University","state":"Uttar Pradesh","short":"Lucknow University"},
  {"name":"Dr. APJ Abdul Kalam Technical University","state":"Uttar Pradesh","short":"AKTU Lucknow"},
  {"name":"Shiv Nadar University","state":"Uttar Pradesh","short":"Shiv Nadar University Noida"},
  {"name":"Galgotias University","state":"Uttar Pradesh","short":"Galgotias University Greater Noida"},
  {"name":"Bennett University","state":"Uttar Pradesh","short":"Bennett University Greater Noida"},
  {"name":"Sharda University","state":"Uttar Pradesh","short":"Sharda University Greater Noida"},
  {"name":"Gautam Buddha University","state":"Uttar Pradesh","short":"GBU Greater Noida"},
  {"name":"IIM Lucknow","state":"Uttar Pradesh","short":"IIM Lucknow"},
  {"name":"Indian Institute of Technology Roorkee","state":"Uttarakhand","short":"IIT Roorkee"},
  {"name":"Graphic Era University","state":"Uttarakhand","short":"Graphic Era University Dehradun"},
  {"name":"Uttaranchal University","state":"Uttarakhand","short":"Uttaranchal University Dehradun"},
  {"name":"DIT University","state":"Uttarakhand","short":"DIT University Dehradun"},
  {"name":"HNB Garhwal University","state":"Uttarakhand","short":"HNBGU Srinagar Garhwal"},
  {"name":"Kumaun University","state":"Uttarakhand","short":"Kumaun University Nainital"},
  {"name":"University of Petroleum and Energy Studies","state":"Uttarakhand","short":"UPES Dehradun"},
  {"name":"IIT Mandi","state":"Himachal Pradesh","short":"IIT Mandi"},
  {"name":"Indian Institute of Science","state":"Karnataka","short":"IISc Bangalore"},
  {"name":"Manipal Academy of Higher Education","state":"Karnataka","short":"Manipal University"},
  {"name":"National Institute of Technology Surathkal","state":"Karnataka","short":"NIT Surathkal"},
  {"name":"Bangalore University","state":"Karnataka","short":"Bangalore University"},
  {"name":"Christ University","state":"Karnataka","short":"Christ University Bangalore"},
  {"name":"RV College of Engineering","state":"Karnataka","short":"RVCE Bangalore"},
  {"name":"PES University","state":"Karnataka","short":"PES University Bangalore"},
  {"name":"BMS College of Engineering","state":"Karnataka","short":"BMSCE Bangalore"},
  {"name":"Visvesvaraya Technological University","state":"Karnataka","short":"VTU Belgaum"},
  {"name":"MS Ramaiah Institute of Technology","state":"Karnataka","short":"MSRIT Bangalore"},
  {"name":"Jain University","state":"Karnataka","short":"Jain University Bangalore"},
  {"name":"National Law School of India University","state":"Karnataka","short":"NLSIU Bangalore"},
  {"name":"University of Mysore","state":"Karnataka","short":"Mysore University"},
  {"name":"Dayananda Sagar University","state":"Karnataka","short":"DSU Bangalore"},
  {"name":"KLE Technological University","state":"Karnataka","short":"KLE Tech Hubli"},
  {"name":"IIT Dharwad","state":"Karnataka","short":"IIT Dharwad"},
  {"name":"IIM Bangalore","state":"Karnataka","short":"IIM Bangalore"},
  {"name":"Indian Institute of Technology Guwahati","state":"Assam","short":"IIT Guwahati"},
  {"name":"Gauhati University","state":"Assam","short":"Gauhati University"},
  {"name":"Tezpur University","state":"Assam","short":"Tezpur University"},
  {"name":"Assam University Silchar","state":"Assam","short":"Assam University Silchar"},
  {"name":"NIT Silchar","state":"Assam","short":"NIT Silchar"},
  {"name":"Indian Institute of Technology Hyderabad","state":"Telangana","short":"IIT Hyderabad"},
  {"name":"University of Hyderabad","state":"Telangana","short":"HCU Hyderabad"},
  {"name":"BITS Pilani Hyderabad Campus","state":"Telangana","short":"BITS Hyderabad"},
  {"name":"Osmania University","state":"Telangana","short":"Osmania University Hyderabad"},
  {"name":"JNTUH","state":"Telangana","short":"JNTUH Hyderabad"},
  {"name":"IIIT Hyderabad","state":"Telangana","short":"IIIT Hyderabad"},
  {"name":"NALSAR University of Law","state":"Telangana","short":"NALSAR Hyderabad"},
  {"name":"Maulana Azad National Urdu University","state":"Telangana","short":"MANUU Hyderabad"},
  {"name":"BITS Pilani","state":"Rajasthan","short":"BITS Pilani"},
  {"name":"University of Rajasthan","state":"Rajasthan","short":"Rajasthan University Jaipur"},
  {"name":"Malaviya National Institute of Technology","state":"Rajasthan","short":"MNIT Jaipur"},
  {"name":"IIT Jodhpur","state":"Rajasthan","short":"IIT Jodhpur"},
  {"name":"Manipal University Jaipur","state":"Rajasthan","short":"Manipal University Jaipur"},
  {"name":"LNM Institute of Information Technology","state":"Rajasthan","short":"LNMIIT Jaipur"},
  {"name":"Banasthali Vidyapith","state":"Rajasthan","short":"Banasthali Vidyapith Rajasthan"},
  {"name":"Central University of Rajasthan","state":"Rajasthan","short":"CURAJ Ajmer"},
  {"name":"Rajasthan Technical University","state":"Rajasthan","short":"RTU Kota"},
  {"name":"Indian Institute of Technology Gandhinagar","state":"Gujarat","short":"IIT Gandhinagar"},
  {"name":"Gujarat University","state":"Gujarat","short":"Gujarat University Ahmedabad"},
  {"name":"Nirma University","state":"Gujarat","short":"Nirma University Ahmedabad"},
  {"name":"DAIICT","state":"Gujarat","short":"DA-IICT Gandhinagar"},
  {"name":"MS University Baroda","state":"Gujarat","short":"MSU Baroda Vadodara"},
  {"name":"Sardar Patel University","state":"Gujarat","short":"SPU Anand"},
  {"name":"Parul University","state":"Gujarat","short":"Parul University Vadodara"},
  {"name":"Pandit Deendayal Energy University","state":"Gujarat","short":"PDEU Gandhinagar"},
  {"name":"Ahmedabad University","state":"Gujarat","short":"Ahmedabad University"},
  {"name":"Silver Oak University","state":"Gujarat","short":"Silver Oak University Ahmedabad"},
  {"name":"IIM Ahmedabad","state":"Gujarat","short":"IIM Ahmedabad"},
  {"name":"Indian Institute of Technology Patna","state":"Bihar","short":"IIT Patna"},
  {"name":"Patna University","state":"Bihar","short":"Patna University"},
  {"name":"NIT Patna","state":"Bihar","short":"NIT Patna"},
  {"name":"Magadh University","state":"Bihar","short":"Magadh University Gaya"},
  {"name":"Indian Institute of Technology Bhubaneswar","state":"Odisha","short":"IIT Bhubaneswar"},
  {"name":"NIT Rourkela","state":"Odisha","short":"NIT Rourkela"},
  {"name":"Utkal University","state":"Odisha","short":"Utkal University Bhubaneswar"},
  {"name":"KIIT University","state":"Odisha","short":"KIIT University Bhubaneswar"},
  {"name":"Centurion University","state":"Odisha","short":"Centurion University Bhubaneswar"},
  {"name":"XIM University","state":"Odisha","short":"XIM University Bhubaneswar"},
  {"name":"SOA University","state":"Odisha","short":"SOA University Bhubaneswar"},
  {"name":"Ravenshaw University","state":"Odisha","short":"Ravenshaw University Cuttack"},
  {"name":"Indian Institute of Technology Indore","state":"Madhya Pradesh","short":"IIT Indore"},
  {"name":"NIT Bhopal","state":"Madhya Pradesh","short":"MANIT Bhopal"},
  {"name":"Devi Ahilya Vishwavidyalaya","state":"Madhya Pradesh","short":"DAVV Indore"},
  {"name":"Barkatullah University","state":"Madhya Pradesh","short":"Barkatullah University Bhopal"},
  {"name":"LNCT University","state":"Madhya Pradesh","short":"LNCT Bhopal"},
  {"name":"IIM Indore","state":"Madhya Pradesh","short":"IIM Indore"},
  {"name":"Panjab University","state":"Punjab","short":"Panjab University Chandigarh"},
  {"name":"Thapar Institute of Engineering and Technology","state":"Punjab","short":"Thapar University Patiala"},
  {"name":"Lovely Professional University","state":"Punjab","short":"LPU Phagwara"},
  {"name":"Guru Nanak Dev University","state":"Punjab","short":"GNDU Amritsar"},
  {"name":"NIT Jalandhar","state":"Punjab","short":"NIT Jalandhar"},
  {"name":"Chandigarh University","state":"Punjab","short":"Chandigarh University"},
  {"name":"IIT Ropar","state":"Punjab","short":"IIT Ropar"},
  {"name":"Chitkara University","state":"Punjab","short":"Chitkara University Rajpura"},
  {"name":"Kerala University","state":"Kerala","short":"Kerala University Thiruvananthapuram"},
  {"name":"NIT Calicut","state":"Kerala","short":"NIT Calicut"},
  {"name":"Cochin University of Science and Technology","state":"Kerala","short":"CUSAT Kochi"},
  {"name":"Amrita Vishwa Vidyapeetham","state":"Kerala","short":"Amrita University Coimbatore"},
  {"name":"College of Engineering Trivandrum","state":"Kerala","short":"CET Thiruvananthapuram"},
  {"name":"Mahatma Gandhi University","state":"Kerala","short":"MG University Kottayam"},
  {"name":"Calicut University","state":"Kerala","short":"Calicut University"},
  {"name":"Indian Institute of Space Science and Technology","state":"Kerala","short":"IIST Thiruvananthapuram"},
  {"name":"IIM Kozhikode","state":"Kerala","short":"IIM Kozhikode"},
  {"name":"Andhra University","state":"Andhra Pradesh","short":"Andhra University Visakhapatnam"},
  {"name":"JNTUK","state":"Andhra Pradesh","short":"JNTUK Kakinada"},
  {"name":"SRM University AP","state":"Andhra Pradesh","short":"SRM University Amaravati"},
  {"name":"VIT-AP University","state":"Andhra Pradesh","short":"VIT AP Amaravati"},
  {"name":"NIT Warangal","state":"Andhra Pradesh","short":"NIT Warangal"},
  {"name":"JNTUA","state":"Andhra Pradesh","short":"JNTUA Anantapur"},
  {"name":"Himachal Pradesh University","state":"Himachal Pradesh","short":"HPU Shimla"},
  {"name":"NIT Hamirpur","state":"Himachal Pradesh","short":"NIT Hamirpur"},
  {"name":"Jaypee University of Information Technology","state":"Himachal Pradesh","short":"JUIT Solan"},
  {"name":"Shoolini University","state":"Himachal Pradesh","short":"Shoolini University Solan"},
  {"name":"XLRI Jamshedpur","state":"Jharkhand","short":"XLRI Jamshedpur"},
  {"name":"NIT Jamshedpur","state":"Jharkhand","short":"NIT Jamshedpur"},
  {"name":"IIT ISM Dhanbad","state":"Jharkhand","short":"IIT ISM Dhanbad"},
  {"name":"Ranchi University","state":"Jharkhand","short":"Ranchi University"},
  {"name":"Pondicherry University","state":"Puducherry","short":"Pondicherry University"},
  {"name":"Goa University","state":"Goa","short":"Goa University"},
  {"name":"NIT Goa","state":"Goa","short":"NIT Goa"},
  {"name":"IIT Goa","state":"Goa","short":"IIT Goa"},
  {"name":"Sikkim Manipal University","state":"Sikkim","short":"SMU Gangtok"},
  {"name":"Sikkim University","state":"Sikkim","short":"Sikkim University Gangtok"},
  {"name":"Mizoram University","state":"Mizoram","short":"Mizoram University Aizawl"},
  {"name":"NIT Mizoram","state":"Mizoram","short":"NIT Mizoram"},
  {"name":"Nagaland University","state":"Nagaland","short":"Nagaland University Kohima"},
  {"name":"Tripura University","state":"Tripura","short":"Tripura University Agartala"},
  {"name":"NIT Agartala","state":"Tripura","short":"NIT Agartala"},
  {"name":"Manipur University","state":"Manipur","short":"Manipur University Imphal"},
  {"name":"NIT Manipur","state":"Manipur","short":"NIT Manipur Imphal"},
  {"name":"North Eastern Hill University","state":"Meghalaya","short":"NEHU Shillong"},
  {"name":"IIM Calcutta","state":"West Bengal","short":"IIM Calcutta"},
  {"name":"Gurugram University","state":"Haryana","short":"Gurugram University"},
  {"name":"Kurukshetra University","state":"Haryana","short":"Kurukshetra University"},
  {"name":"Maharshi Dayanand University","state":"Haryana","short":"MDU Rohtak"},
  {"name":"NIT Kurukshetra","state":"Haryana","short":"NIT Kurukshetra"},
  {"name":"Manav Rachna University","state":"Haryana","short":"MRU Faridabad"},
  {"name":"Amity University Gurugram","state":"Haryana","short":"Amity Gurugram"},
  {"name":"SRM University Sonipat","state":"Haryana","short":"SRM Sonipat"},
  {"name":"O.P. Jindal Global University","state":"Haryana","short":"JGU Sonipat"},
  {"name":"Ashoka University","state":"Haryana","short":"Ashoka University Sonipat"},
  {"name":"Jammu University","state":"Jammu & Kashmir","short":"Jammu University"},
  {"name":"Kashmir University","state":"Jammu & Kashmir","short":"Kashmir University Srinagar"},
  {"name":"NIT Srinagar","state":"Jammu & Kashmir","short":"NIT Srinagar"},
  {"name":"SMVDU","state":"Jammu & Kashmir","short":"SMVDU Katra"},
  {"name":"Dibrugarh University","state":"Assam","short":"Dibrugarh University"},
  {"name":"Cotton University","state":"Assam","short":"Cotton University Guwahati"},
  {"name":"Koneru Lakshmaiah University","state":"Andhra Pradesh","short":"KL University Vijayawada"},
  {"name":"Vignan University","state":"Andhra Pradesh","short":"Vignan University Guntur"},
  {"name":"Gitam University","state":"Andhra Pradesh","short":"GITAM Visakhapatnam"},
  {"name":"Arunachal University of Studies","state":"Arunachal Pradesh","short":"AUS Namsai"},
  {"name":"Rajiv Gandhi University","state":"Arunachal Pradesh","short":"RGU Itanagar"}
]

export default function CollegeInput() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedCollege, setSelectedCollege] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)

    if (value.length > 0) {
      const filtered = COLLEGES.filter(college =>
        college.name.toLowerCase().includes(value.toLowerCase()) ||
        college.short.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5) // Show top 5 suggestions
      setSuggestions(filtered)
      setShowDropdown(true)
    } else {
      setSuggestions([])
      setShowDropdown(false)
    }
  }

  const handleSelectCollege = (college) => {
    setSelectedCollege(college.name)
    setInput(college.name)
    setSuggestions([])
    setShowDropdown(false)

    localStorage.setItem('selectedCollege', JSON.stringify(college))
    navigate(`/college/${encodeURIComponent(college.name)}`)
  }

  return (
    <div className="college-input-container" style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        className="location-btn"
        style={{ cursor: 'text', width: '200px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
        placeholder="📍 Your College"
        value={input}
        onChange={handleInputChange}
        onFocus={() => input && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {showDropdown && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((college, index) => (
            <div
              key={index}
              onMouseDown={() => handleSelectCollege(college)}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
            >
              <div style={{ fontWeight: '500' }}>{college.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>📍 {college.state}</div>
            </div>
          ))}
        </div>
      )}

      {selectedCollege && !showDropdown && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Selected: {selectedCollege}
        </div>
      )}
    </div>
  )
}
