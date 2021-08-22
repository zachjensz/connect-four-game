import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className='title'>
      <div className='gamemode-select'>
        <Link id='dumbot' to='dumbot'>
          Dumbot
        </Link>
        <Link id='smartbot' to='smartbot'>
          Smartbot (Coming Soon)
        </Link>
        <br />
        <Link id='localMultiplayer' to='multiplayer-local'>
          Local Multiplayer (In Progress)
        </Link>
        <Link id='onlineMultiplayer' to='multiplayer'>
          Online Multiplayer (In Progress)
        </Link>
      </div>
    </section>
  )
}
