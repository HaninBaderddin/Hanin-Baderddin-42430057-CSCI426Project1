import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";


//It displays small notification messages on the website, such as when a customer adds an item to the cart or submits an order.
export const Toast = () => {
    const { notification, showNotification } = useCart();

    //Automatically hide the notification
    useEffect(() => {
        if (!notification) return undefined; //If there is no notification, the effect stops without creating a timer.
        const timer = window.setTimeout(() => showNotification(null), 3500); //Create a timer . showNotification(null) clears the notification after that time.
        return () => window.clearTimeout(timer); //It cancels the previous timer when the effect runs again or the component unmounts.
    }, [notification, showNotification]); //The effect runs whenever notification or showNotification changes.

    if (!notification) return null; //If there is no notification, the component returns null, meaning nothing is displayed.

    const isSuccess = notification.type === "success"; //we check whether the notification type is "success".
    const Icon = isSuccess ? CheckCircle2 : Info; // If isSuccess is true, we use CheckCircle2. Otherwise, we use Info.

    return (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-[#073f7020] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#073f70] shadow-[0_12px_30px_rgb(7_63_112_/_18%)]" role="status">
            <Icon size={20} className={isSuccess ? "text-emerald-600" : "text-[#4780a0]"} />
            <span className="flex-1">{notification.message}</span>
            <button type="button" onClick={() => showNotification(null)} aria-label="Close notification" className="text-[#4780a0] transition hover:text-[#073f70]"><X size={18} /></button>
        </div>
    );
};
