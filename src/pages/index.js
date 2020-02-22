import React from "react"
import { Link } from "gatsby"

import Noise from '../components/Noise'
import './index.css'


const IndexPage = () => (
  <div id="main">
    <Noise />
    <div id="info">
      <h1 id="name">Daniel Holmgren</h1>
      <h2 id="description">full-stack &bull; p2p &bull; crypto &bull; remote</h2>
      <Link to="/about/">more &#8594;</Link>
    </div>
  </div>
)

export default IndexPage
