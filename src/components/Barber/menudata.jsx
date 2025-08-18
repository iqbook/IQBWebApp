import { Adminadvertisementicon, Adminbarbericon, Admincustomericon, Admindashboardicon, Adminqueueicon, Adminsalonicon, HistoryIcon } from "../../icons";

export const menudata = [
    {
        id: 1,
        title: "Dashboard",
        icon: <Admindashboardicon />,
        url: "/barber-dashboard"
    },


    {
        id: 2,
        title: "QueueList",
        icon: <Adminqueueicon />,
        url: "/barber-queue"
    },
    {
        id: 3,
        title: "Queue History",
        icon: <HistoryIcon />,
        url: "/barber-quehistory"
    },
    {
        id: 4,
        title: "Appointment",
        icon: <Admincustomericon />,
        url: "/barber-appointment"
    },
    {
        id: 5,
        title: "Appointment list",
        icon: <Admincustomericon />,
        url: "/barber-appointlist"
    },
]
