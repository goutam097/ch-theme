"use client";
import React from 'react'
import type { HeaderSectionProps } from "@/types";
import { SiteLink, useSiteNav } from "../../nav/SiteNavContext";

const HeaderV4 = ({ data }: HeaderSectionProps) => {
    // The menu is derived from the site's pages — add a page, get a link.
    const { links, activePageId } = useSiteNav();

    return (
        <header className="bg-white border-b-2 border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        {data?.logoImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.logoImage} alt="Logo" className="h-8 object-contain" />
                        ) : (
                            <span className="text-2xl font-black text-gray-900">
                                {data?.logoText || "MyWebsite"}<span className="text-blue-600">.</span>
                            </span>
                        )}
                    </div>
                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-12">
                        {links.map((link) => {
                            const isActive = link.pageId === activePageId;

                            return (
                                <SiteLink
                                    key={link.pageId}
                                    link={link}
                                    className={`transition font-medium relative group ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute bottom-0 left-0 h-1 bg-blue-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    ></span>
                                </SiteLink>
                            );
                        })}
                    </nav>
                    {/* Search and Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <button className="text-gray-600 hover:text-blue-600 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                    {/* Mobile Menu Button */}
                    <button id="menuBtn" className="md:hidden text-gray-600 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderV4
