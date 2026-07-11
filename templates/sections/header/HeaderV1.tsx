"use client";
import React, { useEffect, useState } from "react";
import type { HeaderSectionProps } from "@/types";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderV1 = ({ data }: HeaderSectionProps) => {
    const pathname = usePathname();
    const menuItems = data?.menuItems || [
        "Home",
        "About",
        "Services",
        "Gallery",
        "Contact",
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
                    ? "bg-black shadow-lg"
                    : "bg-black"
                    }`}
            >
                <div className="container">
                    <div className="flex items-center justify-between py-2">

                        {(data?.logoImage || data?.logoText) && (
                            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                                {data?.logoImage && (
                                    <img
                                        src={data.logoImage} alt={data?.logoText || "Logo"}
                                        className={`object-contain transition-all duration-500 ${isScrolled ? "w-16 h-16 md:w-18 md:h-18" : "w-20 h-20 md:w-26 md:h-26"
                                            }`}
                                    />
                                )}
                                {data?.logoText && (
                                    <span className="text-2xl font-bold text-white">
                                        {data.logoText}
                                    </span>
                                )}
                            </Link>
                        )}

                        <nav className="hidden lg:block">
                            <ul className="flex items-center gap-8 montserrat-alternates-font">
                                {menuItems.map((item) => {
                                    const href =
                                        item === "Home" ? "/" : `/${item.toLowerCase()}`;

                                    const isActive = pathname === href;

                                    return (
                                        <li key={item}>
                                            <Link
                                                href={href}
                                                className={`relative font-medium text-md tracking-wide transition
                                                        after:absolute
                                                        after:left-0
                                                        after:-bottom-2
                                                        after:h-[2px]
                                                        after:bg-red-500
                                                        after:transition-all
                                                        after:duration-300
                                                        ${isActive
                                                        ? "text-red-500 after:w-full"
                                                        : "text-white after:w-0 hover:text-red-500 hover:after:w-full"
                                                    }`}
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <button onClick={() => setIsOpen(true)} className="lg:hidden text-white">
                            <Menu size={34} />
                        </button>
                    </div>
                </div>
            </header>

            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden
          ${isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
            />

            <div className={`fixed top-0 right-0 h-screen w-80 max-w-[85%] bg-[#111] z-[999] shadow-2xl transition-transform duration-500 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex items-center justify-between h-24 px-6 border-b border-white/10">

                    <img src="/company-logo.svg" alt="" className="w-16" />
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-500">
                        <X size={30} />
                    </button>

                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-[#222]">
                    {menuItems.map((item) => {
                        const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-6 py-4 relative font-medium text-md tracking-wide transition
                                        ${isActive
                                        ? "text-red-500 bg-white/10"
                                        : "text-white hover:text-red-500 hover:bg-white/5"
                                    }`}
                            >
                                {item}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default HeaderV1;
