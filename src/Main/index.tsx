import React from 'react'

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { useSharedStore } from 'appshell/exposed'

import styles from './style.css'

const Remote1App = () => {
    const userId = useSharedStore(state => state.userId)

    return (
        <div className={styles['remote-1']}>
            <h2>Remote 1</h2>
            <div>{userId}</div>
        </div>
    )
}

export default Remote1App