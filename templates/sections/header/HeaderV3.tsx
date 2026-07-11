import React from 'react'
import type { HeaderSectionProps } from "@/types";

const HeaderV3 = ({ data }: HeaderSectionProps) => {
    const menuItems = data?.menuItems || ["Home", "About", "Services", "Gallery", "Contact"];

    return (
        <header className="bg-gray-900 text-white">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        {data?.logoImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={data.logoImage} alt="Logo" className="h-8 object-contain" />
                        ) : (
                            <span className="text-3xl font-black tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                    MW
                                </span>
                            </span>
                        )}
                        {data?.logoText && <span className="text-lg font-bold">{data.logoText}</span>}
                    </div>
                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex space-x-10">
                        {menuItems.map((item) => (
                            <a key={item} href="#" className="text-gray-300 hover:text-white transition text-sm font-semibold uppercase tracking-wide">
                                {item}
                            </a>
                        ))}
                    </nav>
                    {/* Right Side Icons */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <button className="text-gray-300 hover:text-white transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                <path d="M3 4a1 1 0 00-1 1v2h16V5a1 1 0 00-1-1H3zM3 9h16v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                        </button>
                        <button className="text-gray-300 hover:text-white transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
                            </svg>
                        </button>
                    </div>
                    {/* Mobile Menu Button */}
                    <button id="menuBtn" className="lg:hidden text-gray-300 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderV3
