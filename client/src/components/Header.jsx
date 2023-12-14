import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { HiEllipsisVertical } from 'react-icons/hi2'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const dropdownMenu = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownMenu.current &&
                !dropdownMenu.current.contains(e.target) &&
                !e.target.closest('span')
            ) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    return (
        <header className="flex flex-row items-center justify-between py-3 px-4 bg-header-bg sticky top-0 w-full md:py-5 md:px-6">
            <h1 className="text-2xl text-white font-medium md:text-3xl">
                Chats
            </h1>

            <span
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="md:hidden"
            >
                <HiEllipsisVertical color="white" size="2em" />
            </span>

            <div
                className={`max-md:absolute max-md:top-14 max-md:right-8 max-md:bg-[#9ab0b3] max-md:py-3 max-md:px-6 max-md:rounded-lg max-md:transition-all max-md:duration-200 max-md:transform max-md:origin-top-right md:w-full ${
                    isMenuOpen ? 'max-md:scale-100' : 'max-md:scale-0'
                }`}
                ref={dropdownMenu}
            >
                <ul className="flex flex-col gap-3 text-base text-black md:flex-row md:text-white md:text-lg md:w-1/2 md:h-full md:items-center md:justify-evenly md:absolute md:right-0 md:top-0">
                    <li>
                        <NavLink to="/app/account">Account</NavLink>
                    </li>
                    <li>
                        <NavLink to="#">Contact</NavLink>
                    </li>
                    <li>
                        <NavLink to="#">About</NavLink>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export default Header
