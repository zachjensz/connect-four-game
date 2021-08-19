import React from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components'

export default function Home() {
  return (
    <section className='title'>
      <div className='gamemode-select'>
        <Link id='dumbot' to='play'>
          Dumbot
        </Link>
        <Link id='smartbot' to='play'>
          Smartbot
        </Link>
        <br />
        <Link id='localMultiplayer' to='play'>
          Local Multiplayer
        </Link>
        <Link id='onlineMultiplayer' to='play'>
          Online Multiplayer
        </Link>
      </div>
    </section>
  )
}
