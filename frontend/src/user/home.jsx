import React from 'react'
import Header from './header'
import Navbar from './navbar'
import Menu from './specialitymenu'
import Top from './topdoctors'
import Banner from './banner'
import Footer from './footer'

const home = () => {
  return (
    <div>
        <Navbar/>
        <Header/>
        <Menu/>
        <Top/>
        <Banner/>
        <Footer/>
    </div>
  )
}

export default home