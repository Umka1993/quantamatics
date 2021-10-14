import pieImg from "../components/side-bar/assets/pie.svg"
import docImg from "../components/side-bar/assets/doc.svg"
import orgImg from "../components/side-bar/assets/org.svg"
import humanImg from "../components/side-bar/assets/human.svg"
import cogsImg from "../components/side-bar/assets/cogs.svg"
import filesImg from "../components/side-bar/assets/my-files.svg"
import shareImg from "../components/side-bar/assets/share.svg"
import favoritesImg from "../components/side-bar/assets/favorites.svg"
import CoherenceImg from "../components/side-bar/assets/Coherence.svg"

export const SIDE_BAR_ITEMS = [
    // {
    //     name: 'Overview',
    //     image: pieImg,
    //     active: false,
    // },
    {
        name: 'Research',
        image: docImg,
        active: false,
        subItems: [
            {
                name: 'My Files',
                image: filesImg,
                active: true,
                opened: false,
                route: 'research/my-files'
            },
            {
                name: 'Shared With Me',
                image: shareImg,
                active: false,
                opened: false,
                route: 'research/shared-with-me'
            },
            {
                name: 'Favorites',
                image: favoritesImg,
                active: false,
                opened: false,
                route: 'research/favorites'
            },
        ]
    },
    {
        name: 'Coherence',
        image: CoherenceImg,
        active: false,
        route: 'coherence'
    },
    {
        name: 'Organizations',
        image: orgImg,
        active: false,
        route: 'apps/organizations/list'
    },
    // {
    //     name: 'Accounts list',
    //     image: humanImg,
    //     active: false,
    // },
    {
        name: 'Settings',
        image: cogsImg,
        active: false,
        route: 'settings'
    }
]

export const TABLE_ITEMS = [
    {
        editable: true,
        row: {
            organization: 'Dudka Agency',
            customerId: '1231232',
            customerLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }

    },
    {
        editable: false,
        row: {
            organization: 'General Motors',
            customerId: '6542678',
            customerLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }
    },
    {
        editable: false,
        row: {
            organization: 'General Electric',
            customerId: '9873422',
            customerLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }
    },
    {
        editable: true,
        row: {
            organization: 'The Walt Disney Company',
            customerId: '5647444',
            customerLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }
    },
]
export const USER_ORGS = [
    'General Electric',
    'Sony',
    'Starbucks',
    'IBM',
    'The Walt Disney Company'
]
export const USER_TABLE_ITEMS = [
    {
        editable: true,
        row: {
            firstName: 'Alma',
            lastName: 'Robertson',
            email: 'tanya.hill@example.com',
            expirationDate: '18/08/2021',
        }
    },
    {
        editable: true,
        row: {
            firstName: 'Darlene',
            lastName: 'Lawson',
            email: 'sara.cruz@example.com',
            expirationDate: '19/08/2021',
        }
    },
    {
        editable: true,
        row: {
            firstName: 'Alma',
            lastName: 'Robertson',
            email: 'tanya.hill@example.com',
            expirationDate: '18/08/2021',
        }
    },
    {
        editable: true,
        row: {
            firstName: 'Darlene',
            lastName: 'Lawson',
            email: 'sara.cruz@example.com',
            expirationDate: '19/08/2021',
        }
    },
]
export const USER = {
    avatar: '',
    type: '',
    name: 'Lorn',
    surname: 'Davis',
    organization: 'Facteus',
    email: 'lorn@facteus.com',
    exp_date: '12.18.2023'
}
