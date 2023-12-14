const Button = ({ text, onClick, styles }) => {
    return (
        <button
            className={`uppercase bg-header-bg py-1 px-6 rounded-2xl text-white font-medium mt-6 text-base md:text-lg ${styles}`}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button
