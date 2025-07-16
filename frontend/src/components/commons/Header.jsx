import User from '../login/User'

const Header = () => {
  return (
    <div className={"flex justify-between items-center bg-transparent p-4 ${className}"}>
        <p className="text-gray-300">Hola Marcos!</p>
        <User />
    </div>
  )
}

export default Header