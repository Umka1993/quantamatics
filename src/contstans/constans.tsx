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
        route: 'apps/organizations/list',
        pathToActivate: 'apps/organizations/'
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
            id: '1',
            name: 'Dudka Agency',
            customerCrmId: '1231232',
            customerCrmLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }

    },
    {
        editable: false,
        row: {
            id: '2',
            name: 'General Motors',
            customerCrmId: '6542678',
            customerCrmLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }
    },
    {
        editable: false,
        row: {
            id: '3',
            name: 'General Electric',
            customerCrmId: '9873422',
            customerCrmLink: 'http://www.zotware.com',
            comments: 'temporary company for internal needs'
        }
    },
    {
        editable: true,
        row: {
            id: '4',
            name: 'The Walt Disney Company',
            customerCrmId: '5647444',
            customerCrmLink: 'http://www.zotware.com',
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
            id: '0',
            firstName: 'Alma',
            lastName: 'Robertson',
            email: 'tanya.hill@example.com',
            expirationDate: '18/08/2021',
        }
    },
    {
        editable: true,
        row: {
            id: '0',
            firstName: 'Darlene',
            lastName: 'Lawson',
            email: 'sara.cruz@example.com',
            expirationDate: '19/08/2021',
        }
    },
    {
        editable: true,
        row: {
            id: '0',
            firstName: 'Alma',
            lastName: 'Robertson',
            email: 'tanya.hill@example.com',
            expirationDate: '18/08/2021',
        }
    },
    {
        editable: true,
        row: {
            id: '0',
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
