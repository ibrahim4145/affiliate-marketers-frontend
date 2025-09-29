import Card from "@/components/ui/Card";
import TableHeader from "@/components/tables/TableHeader";
import MobileCard from "@/components/tables/MobileCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeadsClient from "./LeadsClient";

// Static data - moved to server-side
const leads = [
    {
      id: 1,
      domain: "techcorp.com",
      owner: "Sarah Johnson",
      company: "TechCorp Inc",
      title: "CTO",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      status: "new",
      industry: "Technology",
      source: "LinkedIn",
      lastContact: "Never"
    },
    {
      id: 2,
      domain: "financeplus.com",
      owner: "Michael Chen",
      company: "Finance Plus",
      title: "CEO",
      email: "michael@financeplus.com",
      phone: "+1 (555) 234-5678",
      status: "contacted",
      industry: "Finance",
      source: "Website",
      lastContact: "2 days ago"
    },
    {
      id: 3,
    domain: "healthcare-solutions.com",
      owner: "Dr. Emily Rodriguez",
    company: "Healthcare Solutions",
    title: "Medical Director",
    email: "emily@healthcare-solutions.com",
      phone: "+1 (555) 345-6789",
      status: "qualified",
      industry: "Healthcare",
      source: "Referral",
      lastContact: "1 week ago"
    },
    {
      id: 4,
    domain: "edutech.com",
      owner: "David Kim",
    company: "EduTech Solutions",
    title: "Founder",
    email: "david@edutech.com",
      phone: "+1 (555) 456-7890",
      status: "new",
      industry: "Education",
    source: "LinkedIn",
    lastContact: "Never"
  },
  {
    id: 5,
    domain: "retailmax.com",
    owner: "Lisa Thompson",
    company: "RetailMax",
    title: "VP of Operations",
    email: "lisa@retailmax.com",
    phone: "+1 (555) 567-8901",
    status: "contacted",
    industry: "Retail",
    source: "Website",
    lastContact: "3 days ago"
  },
  {
    id: 6,
    domain: "manufacturing-pro.com",
    owner: "Robert Wilson",
    company: "Manufacturing Pro",
    title: "Operations Manager",
    email: "robert@manufacturing-pro.com",
    phone: "+1 (555) 678-9012",
    status: "qualified",
    industry: "Manufacturing",
    source: "Trade Show",
    lastContact: "5 days ago"
  },
  {
    id: 7,
    domain: "fintech-innovations.com",
    owner: "Jennifer Lee",
    company: "FinTech Innovations",
    title: "CTO",
    email: "jennifer@fintech-innovations.com",
    phone: "+1 (555) 789-0123",
    status: "new",
    industry: "Finance",
    source: "LinkedIn",
    lastContact: "Never"
  },
  {
    id: 8,
    domain: "medtech-solutions.com",
    owner: "Dr. James Anderson",
    company: "MedTech Solutions",
    title: "Chief Medical Officer",
    email: "james@medtech-solutions.com",
    phone: "+1 (555) 890-1234",
    status: "contacted",
    industry: "Healthcare",
    source: "Conference",
    lastContact: "1 day ago"
  },
  {
    id: 9,
    domain: "edtech-platform.com",
    owner: "Maria Garcia",
    company: "EdTech Platform",
    title: "CEO",
    email: "maria@edtech-platform.com",
    phone: "+1 (555) 901-2345",
    status: "qualified",
    industry: "Education",
    source: "Website",
    lastContact: "2 weeks ago"
  },
  {
    id: 10,
    domain: "retail-tech.com",
    owner: "Alex Johnson",
    company: "Retail Tech",
    title: "Founder",
    email: "alex@retail-tech.com",
    phone: "+1 (555) 012-3456",
    status: "new",
    industry: "Retail",
    source: "LinkedIn",
    lastContact: "Never"
  },
  {
    id: 11,
    domain: "smart-manufacturing.com",
    owner: "Thomas Brown",
    company: "Smart Manufacturing",
    title: "VP of Technology",
    email: "thomas@smart-manufacturing.com",
    phone: "+1 (555) 123-4567",
    status: "contacted",
    industry: "Manufacturing",
    source: "Trade Show",
    lastContact: "4 days ago"
  },
  {
    id: 12,
    domain: "fintech-startup.com",
    owner: "Rachel Davis",
    company: "FinTech Startup",
    title: "Co-Founder",
    email: "rachel@fintech-startup.com",
    phone: "+1 (555) 234-5678",
    status: "qualified",
    industry: "Finance",
    source: "Referral",
    lastContact: "1 week ago"
  },
  {
    id: 13,
    domain: "healthtech-innovations.com",
    owner: "Dr. Sarah Miller",
    company: "HealthTech Innovations",
    title: "Medical Director",
    email: "sarah@healthtech-innovations.com",
    phone: "+1 (555) 345-6789",
    status: "new",
    industry: "Healthcare",
    source: "Conference",
    lastContact: "Never"
  },
  {
    id: 14,
    domain: "edtech-solutions.com",
    owner: "Kevin Wilson",
    company: "EdTech Solutions",
    title: "CTO",
    email: "kevin@edtech-solutions.com",
    phone: "+1 (555) 456-7890",
    status: "contacted",
    industry: "Education",
    source: "Website",
    lastContact: "6 days ago"
  },
  {
    id: 15,
    domain: "retail-innovations.com",
    owner: "Amanda Taylor",
    company: "Retail Innovations",
    title: "VP of Strategy",
    email: "amanda@retail-innovations.com",
    phone: "+1 (555) 567-8901",
    status: "qualified",
    industry: "Retail",
    source: "LinkedIn",
    lastContact: "3 days ago"
  },
  {
    id: 16,
    domain: "advanced-manufacturing.com",
    owner: "Carlos Rodriguez",
    company: "Advanced Manufacturing",
    title: "Operations Director",
    email: "carlos@advanced-manufacturing.com",
    phone: "+1 (555) 678-9012",
    status: "new",
    industry: "Manufacturing",
    source: "Trade Show",
    lastContact: "Never"
  },
  {
    id: 17,
    domain: "fintech-enterprise.com",
    owner: "Michelle Chen",
    company: "FinTech Enterprise",
    title: "CEO",
    email: "michelle@fintech-enterprise.com",
    phone: "+1 (555) 789-0123",
    status: "contacted",
    industry: "Finance",
    source: "Referral",
    lastContact: "2 days ago"
  },
  {
    id: 18,
    domain: "healthcare-tech.com",
    owner: "Dr. Michael Johnson",
    company: "Healthcare Tech",
    title: "Chief Technology Officer",
    email: "michael@healthcare-tech.com",
    phone: "+1 (555) 890-1234",
    status: "qualified",
    industry: "Healthcare",
    source: "Conference",
    lastContact: "1 week ago"
  },
  {
    id: 19,
    domain: "edtech-enterprise.com",
    owner: "Jessica Martinez",
    company: "EdTech Enterprise",
    title: "VP of Product",
    email: "jessica@edtech-enterprise.com",
    phone: "+1 (555) 901-2345",
    status: "new",
    industry: "Education",
    source: "Website",
      lastContact: "Never"
  },
  {
    id: 20,
    domain: "retail-solutions.com",
    owner: "Daniel Kim",
    company: "Retail Solutions",
    title: "Founder",
    email: "daniel@retail-solutions.com",
    phone: "+1 (555) 012-3456",
    status: "contacted",
    industry: "Retail",
    source: "LinkedIn",
    lastContact: "5 days ago"
  }
];

export default function LeadsPage() {
  return <LeadsClient leads={leads} />;
}