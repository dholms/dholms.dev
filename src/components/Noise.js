import React from "react"

import noise from '../scripts/noise'

class Noise extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(document.getElementById('noise-canvas'))
    noise.run()
  }

  componentWillUnmount() {
    noise.stop()
  }

  render() {
    return(
      <canvas id="noise-canvas"></canvas>
    )
  }
}

export default Noise
