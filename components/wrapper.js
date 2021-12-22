import Link from 'next/link';
import Header from './navbar'
import Footer from './footer'


export default function Wrapper({children}) {
    return (
    <body className="layout-top-nav">
      <div className="wrapper">
            <Header/>
            <div className="content-wrapper">
               {children}
                
            </div>
            <Footer/>
      </div>
    </body>
  )
}