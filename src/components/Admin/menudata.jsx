import { useSelector } from "react-redux";
import {
    Admindashboardicon,
    Adminsalonicon,
    Adminbarbericon,
    Admincustomericon,
    Adminadvertisementicon,
    Adminqueueicon,
    Adminappointmenticon,
    Adminreporticon,
    HistoryIcon,
    PaymentIcon,
    Subscription
} from "../../icons";
import { useEffect, useState } from "react";

const MenuData = () => {
    const adminProfile = useSelector(state => state.AdminLoggedInMiddleware.entiredata.user[0])

    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (adminProfile) {
            const items = [
                {
                    id: 1,
                    title: "Dashboard",
                    icon: <Admindashboardicon />,
                    url: "/admin-dashboard",
                    show: true
                },
                {
                    id: 2,
                    title: "Salons",
                    icon: <Adminsalonicon />,
                    url: "/admin-salon",
                    show: true
                },
                {
                    id: 3,
                    title: "Barbers",
                    icon: <Adminbarbericon />,
                    url: "/admin-barber",
                    show: true
                },
                {
                    id: 4,
                    title: "Customers",
                    icon: <Admincustomericon />,
                    url: "/admin-customer",
                    show: true
                },
                {
                    id: 5,
                    title: "Advertisements",
                    icon: <Adminadvertisementicon />,
                    url: "/admin-advertise",
                    show: true
                },
                {
                    id: 6,
                    title: "Queuelist",
                    icon: <Adminqueueicon />,
                    url: "/admin-queue",
                    show: adminProfile?.isQueueing
                },
                {
                    id: 7,
                    title: "Queue History",
                    icon: <HistoryIcon />,
                    url: "/admin-quehistory",
                    show: adminProfile?.isQueueing
                },
                {
                    id: 8,
                    title: "Appointments",
                    icon: <Adminappointmenticon />,
                    url: "/admin-appointments",
                    show: adminProfile?.isAppointments
                },
                {
                    id: 9,
                    title: "Appointment History",
                    icon: <Adminappointmenticon />,
                    url: "/admin-appointmenthistory",
                    show: adminProfile?.isAppointments
                },
                {
                    id: 10,
                    title: "Book Appointments",
                    icon: <Adminqueueicon />,
                    url: "/admin-book-appointments",
                    show: adminProfile?.isAppointments
                },
                {
                    id: 11,
                    title: "Reports",
                    icon: <Adminqueueicon />,
                    url: "/admin-reports",
                    show: true
                },
                {
                    id: 12,
                    title: "Subscription",
                    icon: <Subscription />,
                    url: "/admin-subscription",
                    show: true
                },
                // {
                //     id: 12,
                //     title: "Payments",
                //     icon: <PaymentIcon />,
                //     url: "/admin-paymentstatus",
                //     show: true
                // }
            ];

            setMenuItems(items);
        }
    }, [adminProfile]);

    return menuItems
};

export default MenuData;
