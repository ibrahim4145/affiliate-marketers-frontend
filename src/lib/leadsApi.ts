// API service for leads and contact data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Lead {
  id: string;
  domain: string;
  title: string;
  description: string;
  scraper_progress_id: string;
  scraped: boolean;
  google_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: string;
  lead_id: string;
  email: string;
  page_source: string;
  created_at: string;
  updated_at: string;
}

export interface Phone {
  id: string;
  lead_id: string;
  phone: string;
  page_source: string;
  created_at: string;
  updated_at: string;
}

export interface Social {
  id: string;
  lead_id: string;
  platform: string;
  handle: string;
  page_source: string;
  created_at: string;
  updated_at: string;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LeadWithContacts extends Lead {
  industry: Industry | null;
  emails: Email[];
  phones: Phone[];
  socials: Social[];
}

export interface LeadsStats {
  total_leads: number;
  scraped_leads: number;
  google_done_leads: number;
  unscraped_leads: number;
  progress_stats: Array<{ _id: string; count: number }>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface LeadsResponse {
  leads: LeadWithContacts[];
  pagination: PaginationInfo;
}

// Fetch all leads
export async function fetchLeads(): Promise<Lead[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}


// Fetch emails
export async function fetchEmails(): Promise<Email[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/email`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

// Fetch phones
export async function fetchPhones(): Promise<Phone[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/phone`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching phones:', error);
    throw error;
  }
}

// Fetch social handles
export async function fetchSocials(): Promise<Social[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/social`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching socials:', error);
    throw error;
  }
}

// Fetch leads with pagination and search
export async function fetchLeadsWithContacts(
  page: number = 1,
  limit: number = 50,
  search?: string,
  filter?: string,
  industryFilter?: string
): Promise<LeadsResponse> {
  try {
    const params = new URLSearchParams({
      skip: ((page - 1) * limit).toString(),
      limit: limit.toString()
    });
    
    if (search) params.append('search', search);
    if (filter && filter !== 'all') {
      if (filter === 'scraped') params.append('scraped', 'true');
      if (filter === 'new') params.append('scraped', 'false');
    }
    if (industryFilter && industryFilter !== 'all') {
      params.append('industry_id', industryFilter);
    }
    
    // Add cache-busting parameter
    params.append('_t', Date.now().toString());
    const response = await fetch(`${API_BASE_URL}/leads/combined-data?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads with contacts:', error);
    throw error;
  }
}

// Fetch leads statistics
export async function fetchLeadsStats(): Promise<LeadsStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/stats/summary`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads stats:', error);
    throw error;
  }
}

// Create a new lead
export async function createLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leads: [leadData] })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.created_ids[0]; // Return the created lead
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

// Update a lead
export async function updateLead(leadId: string, leadData: Partial<Lead>): Promise<Lead> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

// Delete a lead
export async function deleteLead(leadId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}
