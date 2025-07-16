import mono from '../../assets/mono.png'

const User = () => {
  return (
    <div className= {"flex bg-gradient-to-br from-violet-400 to-orange-600 border-none rounded-full p-[0.5px] ${className}"}>
        <img src={mono} className="w-10 h-10 rounded-[100%]" />
    </div>
  )
}

export default User