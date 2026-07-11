import React, { useEffect, useState } from 'react'
import type { HeaderSectionProps } from "@/types";
import { ChevronDown, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HeaderV2 = ({ data }: HeaderSectionProps) => {
    const pathname = usePathname();

    const menuItems = data?.menuItems || ["Home", "About", "Services", "Gallery", "Contact"];
    const [isOpen, setIsOpen] = useState(false);
    const [serviceOpen, setServiceOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Disable body scroll when mobile menu opens
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Header background on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                // className={`fixed top-0 left-0 w-full z-50 py-3 transition-all duration-500 ${isScrolled
                //     ? "bg-black/40 backdrop-blur-md shadow-xl border-b border-white/10"
                //     : "bg-transparent"
                //     }`}
                className={`fixed top-0 left-0 w-full z-50 py-3 transition-all duration-500 ${isScrolled
                    ? "bg-black/40 backdrop-blur-md shadow-xl border-b border-white/10"
                    : "bg-transparent"
                    }`}
            >
                <div className="container">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <img
                                src={data.logoImage} alt="Elite"
                                className={`object-contain transition-all duration-500 ${isScrolled ? "w-16 h-16 md:w-18 md:h-18" : "w-20 h-20 md:w-26 md:h-26"
                                    }`}
                            />
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden lg:block">
                            <ul className="flex items-center gap-10 xl:gap-12 montserrat-alternates-font">
                                {menuItems.map((item) => {
                                    const href =
                                        item === "Home" ? "/" : `/${item.toLowerCase()}`;

                                    const isActive = pathname === href;

                                    return (
                                        <li key={item} className="relative group">
                                            <Link href={item}
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

                                    )
                                })}
                            </ul>
                        </nav>

                        {/* Mobile Menu */}
                        <button onClick={() => setIsOpen(true)} className="lg:hidden text-white">
                            <Menu size={34} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Overlay */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden
          ${isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                    }`}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-screen w-80 max-w-[85%] bg-[#111] z-[999]
        shadow-2xl transition-transform duration-500 flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-24 px-6 border-b border-white/10 shrink-0">
                    <img src="/company-logo.svg" alt="Elite" className="w-16" />

                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white"
                    >
                        <X size={30} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#E91E63] scrollbar-track-[#222]">
                    {menuItems.map((item) => {
                        const href =
                            item === "Home" ? "/" : `/${item.toLowerCase()}`;

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
                        )
                    })}
                </nav>
            </div>
            {/* <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-3">
                        {data?.logoImage ? (
                            <img src={data.logoImage} alt="Logo" className="h-10 object-contain" />
                        ) : (
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="font-bold text-blue-600 text-lg">MW</span>
                            </div>
                        )}
                        <span className="text-xl font-bold">{data?.logoText || "MyWebsite"}</span>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        {menuItems.map((item) => (
                            <a key={item} href="#" className="hover:text-blue-100 transition font-medium">
                                {item}
                            </a>
                        ))}
                    </nav>
                    <button className="hidden md:block bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition">
                        Get Started
                    </button>
                    <button id="menuBtn" className="md:hidden text-white focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header> */}
        </>
    )
}

export default HeaderV2
