export interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface SalesChartProps {
  data: { date: string; totalAmount: number }[];
}

export interface ProductStockChartProps {
  data: { name: string; value: number; fill: string }[];
}

export interface UserRegistrationChartProps {
  data: { month: string; users: number }[];
}

export interface DashboardChartsTabProps {
  salesData: { date: string; totalAmount: number }[];
  productStockData: { name: string; value: number; fill: string }[];
  userRegistrationData: { month: string; users: number }[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: string;
  createdAt: Date;
}

export interface UsersTabProps {
  users: User[];
}

export interface Product {
  id: string;
  name: string;
  price: any;
  stock: number;
  createdAt: Date;
}

export interface ProductsTabProps {
  products: Product[];
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: any;
  status: string;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface OrdersTabProps {
  orders: Order[];
}

export interface Brand {
  id: string;
  company: string;
  logo: string;
  active: boolean;
  createdAt: Date;
}

export interface BrandsTabProps {
  brands: Brand[];
}

export interface Billboard {
  id: string;
  label: string;
  image: string;
  state: string;
  category: string;
  createdAt: Date;
}

export interface BillboardsTabProps {
  billboards: Billboard[];
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  location: string;
  status: string;
  createdAt: Date;
}

export interface StoresTabProps {
  stores: Store[];
}

export interface Collection {
  id: string;
  label: string;
  image: string;
  state: string;
  category: string;
  createdAt: Date;
}

export interface CollectionsTabProps {
  collections: Collection[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  state: string;
  published: boolean;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface DocumentsTabProps {
  documents: Document[];
}

export interface Note {
  id: string;
  title: string;
  tag: string | null;
  status: string | null;
  published: boolean;
  createdAt: Date;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface NotesTabProps {
  notes: Note[];
}
