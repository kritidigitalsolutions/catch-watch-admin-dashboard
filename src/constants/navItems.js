import {
  LayoutDashboard, Users, Film, PlusCircle, CreditCard,
  Tag, BadgeCheck, Bell, Shield, Settings
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/dashboard' },
  { icon: Users,           label: 'User Management', path: '/users' },
  { 
    icon: Film, 
    label: 'Content Library', 
    path: '/content',
    children: [
      { label: 'Movies',       path: '/content/movies' },
      { label: 'Web Series',   path: '/content/series' },
      { label: 'Short Dramas', path: '/content/dramas' },
    ]
  },
  { icon: PlusCircle,   label: 'Add Content',       path: '/content/add' },
  { icon: CreditCard,   label: 'Subscriptions',     path: '/subscriptions' },
  { icon: Tag,          label: 'Promo & Vouchers',  path: '/promos' },
  { icon: BadgeCheck,   label: 'User Plans',        path: '/user-plans' },
  { icon: Bell,         label: 'Notifications',     path: '/notifications' },
  { icon: Shield,       label: 'Legal & Support',   path: '/legal' },
  { icon: Settings,     label: 'Settings',          path: '/settings' },
];

export default navItems;
