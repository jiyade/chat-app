const Setting = ({ children, styles, onClick }) => {
    return (
        <li className={`text-lg md:text-4xl ${styles}`} onClick={onClick}>
            {children}
        </li>
    )
}

export default Setting
