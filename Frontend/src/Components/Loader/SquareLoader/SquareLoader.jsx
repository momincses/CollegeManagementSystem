import React from 'react'
import styles from "./SquareLoader.module.css"

const SquareLoader = () => {
  return (
    <div className={styles.loaderScreen}>
<div className={styles.loader}></div>
</div>
  )
}

export default SquareLoader