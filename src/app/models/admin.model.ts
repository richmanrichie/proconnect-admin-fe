export interface MenuItem {
  key: number;
  icon: string;
  label: string;
  route: string;
  alt_route: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isFirstLogin: boolean;
  role: string;
}

export interface SetupResponse {
  status: string;
  data: {
    menu: MenuItem[];
    user: User;
    dashboard_data: any; // Define more specific type if needed
  };
  message: string;
}
