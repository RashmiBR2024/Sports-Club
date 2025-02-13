import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SandHut Sports Club",
  description:
    "SandHut Sports Club was founded in 2023 by a group of passionate cricket enthusiasts who wanted to create a community where players of all skill levels could come together and enjoy the game they loved. Hoping Over the years, SandHut Sports Club will grown into one of the premier cricket clubs in the region, hosting tournaments and events that draw players from all over India and beyond.",
  icons: {
    icon: "/sandhut_sports_club_W.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>SandHut Sports Club</title>
        <link rel="icon" href="SSC logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
