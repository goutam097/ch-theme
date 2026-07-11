import React from 'react'
import type { HeaderSectionProps } from "@/types";

const HeaderV5 = ({ data }: HeaderSectionProps) => {
    const menuItems = data?.menuItems || ["Home", "About", "Services", "Gallery", "Contact"];

    return (
        <header className="bg-gradient-to-b from-white to-gray-50 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-24">
                    {/* Logo Section */}
                    <div className="flex flex-col gap-1">
                        {data?.logoImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.logoImage} alt="Logo" className="h-8 object-contain" />
                        ) : (
                            <>
                                <span className="text-2xl font-bold text-gray-900">{data?.logoText || "MyWebsite"}</span>
                                <span className="text-xs text-gray-500 font-semibold tracking-widest">CREATIVE AGENCY</span>
                            </>
                        )}
                    </div>
                    {/* Desktop Menu - Centered */}
                    <nav className="hidden lg:flex space-x-14 absolute left-1/2 transform -translate-x-1/2">
                        {menuItems.map((item) => (
                            <a key={item} href="#" className="text-gray-700 hover:text-blue-600 transition font-medium text-sm">
                                {item}
                            </a>
                        ))}
                    </nav>
                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <button className="text-gray-700 hover:text-blue-600 transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        <button className="bg-blue-600 text-white px-8 py-2 rounded-full font-bold hover:bg-blue-700 transition text-sm">
                            Join Now
                        </button>
                    </div>
                    {/* Mobile Menu Button */}
                    <button id="menuBtn" className="lg:hidden text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderV5
