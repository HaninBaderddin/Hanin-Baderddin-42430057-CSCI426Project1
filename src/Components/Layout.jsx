import { useLocation, useNavigate } from "react-router-dom";
import { CameraIcon, Mail, Phone, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { itemCount } = useCart();
    const hasStandaloneLayout = location.pathname === "/login" || location.pathname.startsWith("/admin");

    if (hasStandaloneLayout) {
        return children;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#fffdf8]">
            <header className="sticky top-0 z-40 h-[88px] shrink-0 border-b border-[#073f7020] bg-[#fffdf8]">
                <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-10">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        aria-label="Go to homepage"
                        className="absolute left-1/2 -translate-x-1/2"
                    >
                        <img
                            src="https://i.postimg.cc/Kj3zVJ4Y/Salt-logo1.png"
                            alt="SALT"
                            className="h-28 w-auto object-contain"
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        aria-label={`Shopping cart with ${itemCount} items`}
                        className="relative ml-auto flex h-10 w-10 items-center justify-center text-[#073f70] transition hover:text-[#0a568f]"
                    >
                        <ShoppingCart size={22} strokeWidth={1.7} />
                        <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#073f70] px-1 text-[9px] font-bold text-white">
                            {itemCount}
                        </span>
                    </button>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="bg-[#052d45] text-white">
                <div className="mx-auto max-w-7xl px-6 py-9 sm:px-10">
                    <div>
                        <h3 className="text-xl font-semibold tracking-[0.18em] text-white">SALT</h3>
                        <p className="mt-1 text-xs text-[#c6e2e8]">Good food. Good moments.</p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <a href="mailto:@salt.com" className="flex items-center gap-3 text-sm text-[#c6e2e8] transition hover:text-white">
                            <Mail size={17} strokeWidth={1.7} />
                            <span>@salt.com</span>
                        </a>
                        <a href="tel:+96181984172" className="flex items-center gap-3 text-sm text-[#c6e2e8] transition hover:text-white">
                            <Phone size={17} strokeWidth={1.7} />
                            <span>+961 81 984 172</span>
                        </a>
                        <a
                            href="https://www.instagram.com/your-account"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Follow SALT on Instagram"
                            className="flex w-fit items-center gap-3 text-sm text-[#c6e2e8] transition hover:text-white"
                        >
                            <CameraIcon size={18} strokeWidth={1.7} />
                            <span>Follow us</span>
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/10 px-6 py-4 sm:px-10">
                    <p className="mx-auto max-w-7xl text-left text-[11px] text-[#c6e2e8]/75">
                        © {new Date().getFullYear()} SALT Restaurant. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};
