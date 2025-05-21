export interface AppTheme {
  primary: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  text: string;
  subtextOne: string;
  error: string;
  link: string;
  highlight: string;
  success: string;
  buttonText: string;
}

export const lightTheme: AppTheme = {
  primary: '#0c0c48',
  background: '#ffffff',
  backgroundSecondary: '#f2f2f2',
  backgroundTertiary: '#cccccc',
  text: '#212121',
  subtextOne: '#999999',
  error: '#cc0000',
  link: '#1f2bd4',
  highlight: '#00caef',
  success: '#4CAF50',
  buttonText: '#ffffff',
};

export const darkTheme: AppTheme = {
  primary: '#0c0c48',
  background: '#212121',
  backgroundSecondary: '#3e3e3e',
  backgroundTertiary: '#666666',
  text: '#ffffff',
  subtextOne: '#999999',
  error: '#cc0000',
  link: '#1f2bd4',
  highlight: '#00caef',
  success: '#81C784', 
  buttonText: '#ffffff',
};