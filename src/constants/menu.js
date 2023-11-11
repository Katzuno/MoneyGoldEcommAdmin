import {
    Home,
    Box,
    DollarSign,
    Tag,
    Clipboard,
    Camera,
    AlignLeft,
    UserPlus,
    Users,
    Chrome,
    BarChart, Settings, Archive, LogIn, DivideCircle
} from 'react-feather';

export const MENUITEMS = [
    {
        path: '/dashboard', title: 'Panou de control', icon: Home, type: 'link', badgeType: 'primary', active: false
    },
    {
        title: 'Produse', icon: Box, type: 'sub', active: false, children: [
            // { path: '/products/category', title: 'Category', type: 'link' },
            { path: '/products/product-list', title: 'Lista de produse', type: 'link' },
        ]
    },
    {
        title: 'Comenzi', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/sales/orders', title: 'Lista de comenzi', type: 'link' },
        ]
    },
    {
        title: 'Promotii', icon: Tag, type: 'sub', active: false, children: [
            { path: '/coupons/list-coupons', title: 'Lista de promotii', type: 'link' },
            { path: '/coupons/create-coupons', title: 'Creeare promotii', type: 'link' },
        ]
    },
    {
        title: 'Pages', icon: Clipboard , type: 'sub', active: false, children: [
            { path: '/pages/list-page', title: 'List Page', type: 'link' },
            { path: '/pages/create-page', title: 'Create Page', type: 'link' },
        ]
    },
    {
        title: 'Media', path: '/media', icon: Camera, type: 'link', active: false
    },
    {
        title: 'Menus', icon: AlignLeft, type: 'sub', active: false, children: [
            { path: '/menus/list-menu', title: 'List Menu', type: 'link' },
            { path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
        ]
    },
    {
        title: 'Utilizatori', icon: UserPlus, type: 'sub', active: false, children: [
            { path: '/users/list-user', title: 'Lista utilizatori', type: 'link' },
            // { path: '/users/create-user', title: 'Create User', type: 'link' },
        ]
    },
    {
        title: 'Reports', path:'/reports/report', icon: BarChart, type: 'link', active: false
    },
    {
        title: 'Facturi', path:'/invoice', icon: Archive, type: 'link', active: false
    },
]
