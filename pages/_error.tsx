import React from 'react'
import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

class Error extends React.Component<ErrorProps> {
  static getInitialProps({ res, err }: NextPageContext) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
  }

  render() {
    const { statusCode } = this.props
    return (
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
}

export default Error