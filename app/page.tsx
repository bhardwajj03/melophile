import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Users, Radio, Headphones } from 'lucide-react'
import Appbar from './components/Appbar'
import Redirect from './components/Redirect'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-600 to-gray-900">
      <Appbar />
      <Redirect />
      <main className="flex-1  py-12 md:py-24 lg:py-32" >
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Let Your Fans Choose the Soundtrack to Your Stream
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  FanTune revolutionizes music streaming by putting the power in your fans' hands. Create unforgettable streams with music chosen by your audience.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="text-white border-white hover:bg-white hover:text-black">Get Started</Button>
                <Button  className="text-white border-white hover:bg-white hover:text-black">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Why Creators Love FanTune
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Engage Your Audience</h3>
                <p className="text-gray-600">Let your fans feel involved by choosing the music for your stream.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Radio className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
                <p className="text-gray-600">Easily integrate FanTune with your favorite streaming platforms.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Headphones className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">Discover New Music</h3>
                <p className="text-gray-600">Explore new tracks and artists through your fans' selections.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">For Creators</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">1.</span> Sign up and connect your streaming account
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">2.</span> Share your unique FanTune link with your audience
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">3.</span> Start your stream and let the fan-picked music play
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">For Fans</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">1.</span> Visit your favorite creator's FanTune link
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">2.</span> Browse and vote for songs in the music queue
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-600">3.</span> Enjoy hearing your picks during the stream
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="signup" className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Streams?
                </h2>
                <p className="mx-auto max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join FanTune today and start creating unforgettable music experiences with your fans.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2">
                  <Input
                    className="bg-white text-black placeholder:text-gray-500"
                    placeholder="Enter your email"
                    type="email"
                    required
                  />
                  <Button className="bg-black text-white hover:bg-gray-800" type="submit">
                    Sign Up for Early Access
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2023 FanTune. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

