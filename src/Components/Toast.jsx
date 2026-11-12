import { CheckCircle2, Info, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export const Toast = () => {
    const { notification, showNotification } = useCart();

    useEffect(() => {
        if (!notification) return undefined;
        const timer = window.setTimeout(() => showNotification(null), 3500);
        return () => window.clearTimeout(timer);
    }, [notification, showNotification]);

    if (!notification) return null;

    const isSuccess = notification.type === "success";
    const Icon = isSuccess ? CheckCircle2 : Info;

    return (
        <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border border-[#073f7020] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#073f70] shadow-[0_12px_30px_rgb(7_63_112_/_18%)]" role="status">
            <Icon size={20} className={isSuccess ? "text-emerald-600" : "text-[#4780a0]"} />
            <span className="flex-1">{notification.message}</span>
            <button type="button" onClick={() => showNotification(null)} aria-label="Close notification" className="text-[#4780a0] transition hover:text-[#073f70]"><X size={18} /></button>
        </div>
    );
};
