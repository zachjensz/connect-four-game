import React from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components'

export default function Home() {
  return (
    <section className='title'>
      <div className='gamemode-select'>
        <Link id='dumbot' to='computer'>
          Dumbot
        </Link>
        <Link id='smartbot' to=''>
          Smartbot
        </Link>
        <br />
        <Link id='localMultiplayer' to=''>
          Local Multiplayer
        </Link>
        <Link id='onlineMultiplayer' to='play'>
          Online Multiplayer
        </Link>
      </div>
    </section>
  )
}
