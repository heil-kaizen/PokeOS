export type WindowState = 'open' | 'minimized' | 'maximized' | 'closed';

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  component: string;
  state: WindowState;
  zIndex: number;
  width?: number;
  height?: number;
}
