"use client";
import React, { useEffect, useState } from 'react'
import type { HeaderSectionProps } from "@/types";
import { Menu, X } from 'lucide-react';
import { SiteLink, useSiteNav } from "../../nav/SiteNavContext";

const HeaderV2 = ({ data }: HeaderSectionProps) => {
    // The menu is derived from the site's pages — add a page, get a link.
    const { links, homeLink, activePageId } = useSiteNav();
    const [isOpen, setIsOpen] = useState(false);
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
                        {homeLink && (
                            <SiteLink link={homeLink} className="flex-shrink-0 flex items-center gap-2">
                                {data?.logoImage && (
                                    <img
                                        src={data.logoImage} alt={data?.logoText || "Logo"}
                                        className={`object-contain transition-all duration-500 ${isScrolled ? "w-16 h-16 md:w-18 md:h-18" : "w-20 h-20 md:w-26 md:h-26"
                                            }`}
                                    />
                                )}
                                {data?.logoText && (
                                    <span className="text-2xl font-bold text-white">{data.logoText}</span>
                                )}
                            </SiteLink>
                        )}

                        {/* Desktop Menu */}
                        <nav className="hidden lg:block">
                            <ul className="flex items-center gap-10 xl:gap-12 montserrat-alternates-font">
                                {links.map((link) => {
                                    const isActive = link.pageId === activePageId;

                                    return (
                                        <li key={link.pageId} className="relative group">
                                            <SiteLink
                                                link={link}
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
                                                {link.label}
                                            </SiteLink>
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
                    {links.map((link) => {
                        const isActive = link.pageId === activePageId;

                        return (
                            <SiteLink
                                key={link.pageId}
                                link={link}
                                onClick={() => setIsOpen(false)}
                                className={`block w-full text-left px-6 py-4 relative font-medium text-md tracking-wide transition
                                ${isActive
                                        ? "text-red-500 bg-white/10"
                                        : "text-white hover:text-red-500 hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </SiteLink>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}

export default HeaderV2
