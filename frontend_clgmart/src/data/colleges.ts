export interface College {
  name: string;
  short: string;
  state: string;
  type: "IIT" | "NIT" | "IIIT" | "GFTI" | "IIM" | "University" | "College" | "Law" | "Research";
  josaa: boolean;
}

const COLLEGES: College[] = [
  {
    "name": "Indian Institute of Technology Bombay",
    "state": "Maharashtra",
    "short": "IIT Bombay",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Delhi",
    "state": "Delhi",
    "short": "IIT Delhi",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Madras",
    "state": "Tamil Nadu",
    "short": "IIT Madras",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Kanpur",
    "state": "Uttar Pradesh",
    "short": "IIT Kanpur",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Kharagpur",
    "state": "West Bengal",
    "short": "IIT Kharagpur",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Roorkee",
    "state": "Uttarakhand",
    "short": "IIT Roorkee",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Guwahati",
    "state": "Assam",
    "short": "IIT Guwahati",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Hyderabad",
    "state": "Telangana",
    "short": "IIT Hyderabad",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Indore",
    "state": "Madhya Pradesh",
    "short": "IIT Indore",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Mandi",
    "state": "Himachal Pradesh",
    "short": "IIT Mandi",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Patna",
    "state": "Bihar",
    "short": "IIT Patna",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Gandhinagar",
    "state": "Gujarat",
    "short": "IIT Gandhinagar",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Bhubaneswar",
    "state": "Odisha",
    "short": "IIT Bhubaneswar",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Jodhpur",
    "state": "Rajasthan",
    "short": "IIT Jodhpur",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Ropar",
    "state": "Punjab",
    "short": "IIT Ropar",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology BHU Varanasi",
    "state": "Uttar Pradesh",
    "short": "IIT BHU Varanasi",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology ISM Dhanbad",
    "state": "Jharkhand",
    "short": "IIT ISM Dhanbad",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Bhilai",
    "state": "Chhattisgarh",
    "short": "IIT Bhilai",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Goa",
    "state": "Goa",
    "short": "IIT Goa",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Palakkad",
    "state": "Kerala",
    "short": "IIT Palakkad",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Tirupati",
    "state": "Andhra Pradesh",
    "short": "IIT Tirupati",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Jammu",
    "state": "Jammu & Kashmir",
    "short": "IIT Jammu",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "Indian Institute of Technology Dharwad",
    "state": "Karnataka",
    "short": "IIT Dharwad",
    "type": "IIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Tiruchirappalli",
    "state": "Tamil Nadu",
    "short": "NIT Trichy",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Karnataka Surathkal",
    "state": "Karnataka",
    "short": "NIT Surathkal",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Warangal",
    "state": "Telangana",
    "short": "NIT Warangal",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Calicut",
    "state": "Kerala",
    "short": "NIT Calicut",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Rourkela",
    "state": "Odisha",
    "short": "NIT Rourkela",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Visvesvaraya National Institute of Technology Nagpur",
    "state": "Maharashtra",
    "short": "VNIT Nagpur",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Sardar Vallabhbhai National Institute of Technology Surat",
    "state": "Gujarat",
    "short": "SVNIT Surat",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Malaviya National Institute of Technology Jaipur",
    "state": "Rajasthan",
    "short": "MNIT Jaipur",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Maulana Azad National Institute of Technology Bhopal",
    "state": "Madhya Pradesh",
    "short": "MANIT Bhopal",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Motilal Nehru National Institute of Technology Allahabad",
    "state": "Uttar Pradesh",
    "short": "MNNIT Allahabad",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Durgapur",
    "state": "West Bengal",
    "short": "NIT Durgapur",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Silchar",
    "state": "Assam",
    "short": "NIT Silchar",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Hamirpur",
    "state": "Himachal Pradesh",
    "short": "NIT Hamirpur",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Kurukshetra",
    "state": "Haryana",
    "short": "NIT Kurukshetra",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "Dr BR Ambedkar National Institute of Technology Jalandhar",
    "state": "Punjab",
    "short": "NIT Jalandhar",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Jamshedpur",
    "state": "Jharkhand",
    "short": "NIT Jamshedpur",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Patna",
    "state": "Bihar",
    "short": "NIT Patna",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "National Institute of Technology Srinagar",
    "state": "Jammu & Kashmir",
    "short": "NIT Srinagar",
    "type": "NIT",
    "josaa": true
  },
  {
    "name": "IIM Ahmedabad",
    "state": "Gujarat",
    "short": "IIM Ahmedabad",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "IIM Bangalore",
    "state": "Karnataka",
    "short": "IIM Bangalore",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "IIM Calcutta",
    "state": "West Bengal",
    "short": "IIM Calcutta",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "IIM Lucknow",
    "state": "Uttar Pradesh",
    "short": "IIM Lucknow",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "IIM Indore",
    "state": "Madhya Pradesh",
    "short": "IIM Indore",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "IIM Kozhikode",
    "state": "Kerala",
    "short": "IIM Kozhikode",
    "type": "IIM",
    "josaa": false
  },
  {
    "name": "University of Delhi",
    "state": "Delhi",
    "short": "DU Delhi",
    "type": "University",
    "josaa": false
  },
  {
    "name": "BITS Pilani",
    "state": "Rajasthan",
    "short": "BITS Pilani",
    "type": "University",
    "josaa": false
  },
  {
    "name": "Manipal Academy of Higher Education",
    "state": "Karnataka",
    "short": "Manipal University",
    "type": "University",
    "josaa": false
  },
  {
    "name": "VIT University Vellore",
    "state": "Tamil Nadu",
    "short": "VIT Vellore",
    "type": "University",
    "josaa": false
  },
  {
    "name": "SRM Institute of Science and Technology Chennai",
    "state": "Tamil Nadu",
    "short": "SRM Chennai",
    "type": "University",
    "josaa": false
  }
];

export default COLLEGES;
