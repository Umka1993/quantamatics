import pieImg from "../../../components/side-bar/assets/pie.svg"
import docImg from "../../../components/side-bar/assets/doc.svg"
import orgImg from "../../../components/side-bar/assets/org.svg"
import humanImg from "../../../components/side-bar/assets/human.svg"
import cogsImg from "../../../components/side-bar/assets/cogs.svg"

export const SIDE_BAR_ITEMS = [
    {
        name: 'Overview',
        image: pieImg,
        active: false
    },
    {
        name: 'Research',
        image: docImg,
        active: false
    },
    {
        name: 'Organizations',
        image: orgImg,
        active: true
    },
    {
        name: 'Accounts list',
        image: humanImg,
        active: false
    },
    {
        name: 'Settings',
        image: cogsImg,
        active: false
    }
]