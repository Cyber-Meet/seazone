const storedfullName = sessionStorage.getItem('fullName');
const storeduser_type = sessionStorage.getItem('user_type');
//use useeffect to update the menu items based on the user type

export const MenuItems = [
    {
        title: 'Home',
        url: '/',
        cName: 'nav-links',
        icon: "fa-solid fa-house"
    },
    {
        title: 'Dining',
        url: '/dining',
        cName: 'nav-links',
        icon: "fa-solid fa-utensils"
    },
    {
        title: 'Amenities',
        url: '/amenities',
        cName: 'nav-links',
        icon: "fa-solid fa-spa"
    },
    {
        title: 'Rooms',
        url: '/rooms',
        cName: 'nav-links',
        icon: "fa-solid fa-bed"
    },
    storedfullName === null
        ? {
            title: 'Contact',
            url: '/contact',
            cName: 'nav-links',
            icon: "fa-solid fa-contact-book"
        }
        : {
            title: 'Profile',
            url: '/profile',
            cName: 'nav-links',
            icon: "fa-solid fa-user"
        },

        storeduser_type === "admin"
        ? {
            title: 'Dashboard',
            url: '/dashboard',
            cName: 'nav-links-mobile',
        }
        : {
            title: storeduser_type === "staff" ? 'Staff Dashboard' : 'Book Now',
            url: storeduser_type === "staff" ? '/staff' : '/booking',
            cName: 'nav-links-mobile',
        },
    {
        title: 'Login',
        url: '/login',
        cName: 'nav-links-mobile',
    }
];
