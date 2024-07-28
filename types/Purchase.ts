export interface Purchase {
  id: string;
  user_id: string;
  name: string;
  price: number;
  date: string;
  notes?: string;
  warranty_end_date?: string | null;
}