export interface User {

  id: string;

  name: string;

  password?: string;

  role: 'admin' | 'developer' | 'user';
}
