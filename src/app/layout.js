import { Inter } from 'next/font/google'
import './globals.css'
import '@radix-ui/themes/styles.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Navbar from './components/Navbar';
import CustomFooter from './components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SandHut Sports Club',
  description: 'SandHut Sports Club was founded in 2023 by a group of passionate cricket enthusiasts who wanted to create a community where players of all skill levels could come together and enjoy the game they loved. Hoping Over the years, SandHut Sports Club will grown into one of the premier cricket clubs in the region, hosting tournaments and events that draw players from all over India and beyond.',
  icons: {
    icon: "/sandhut_sports_club_W.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <link rel="icon" href="SSC icon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Prosto+One&display=swap"
        rel="stylesheet"
      />
        <AntdRegistry>
          <Navbar/>
          <div className="pt-40"> {/* Ensures space for the fixed navbar */}
            {children}
          </div>
          <CustomFooter/>
        </AntdRegistry>
      </body>
    </html>
  )
}
