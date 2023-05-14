import { useState } from "react"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"

export default function OnBoarding() {
  const [index, setIndex] = useState(0)

  const pages = [Intro1, Intro2, Intro3]
  const getSection = () => {
    switch (index) {
      case 0:
        return <Intro1 />
      case 1:
        return <Intro2 />
      case 2:
        return <Intro3 />
      default:
        throw Error("Not a valid case")
    }
  }

  return (
    <div className="flex h-screen flex-col items-center gap-4">
      <div className="absolute right-0 top-0 p-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md grow flex-col md:justify-around">
        <div className="p-8"></div>
        <div className="flex flex-col items-center rounded-3xl p-10 md:dark:bg-grey">
          <div className="font-header">RÖOTED</div>
          <div className="flex h-96 flex-col ">{getSection()}</div>
          <div className="flex flex-row gap-36">
            {index !== 0 && (
              <div
                className="flex flex-col items-center pt-8"
                onClick={() => {
                  setIndex((index - 1 + pages.length) % pages.length)
                }}
              >
                <ArrowLeftCircle className="h-10 w-10" />
                <p className="p-2">back</p>
              </div>
            )}
            <div
              className="flex flex-col items-center pt-8"
              onClick={() => {
                setIndex((index + 1) % pages.length)
              }}
            >
              <ArrowRightCircle className="h-10 w-10" />
              <p className="p-2">next</p>
            </div>
          </div>
          <div className="pt-8 opacity-70">skip</div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

function Intro1() {
  return (
    <>
      <div className="p-16"></div>
      <div className="pb-10 text-center font-header text-3xl uppercase">
        understand <br />
        your plant{"'"}s needs
      </div>
      <div className="text-center">
        <div>
          {'"'}when to water?{'"'}
        </div>
        <div>
          {'"'}how to water?{'"'}
        </div>
      </div>
    </>
  )
}

function Intro2() {
  return (
    <>
      <div className="p-16"></div>
      <div className="pb-10 text-center font-header text-3xl uppercase">
        record your <br />
        plant tasks
      </div>
    </>
  )
}

function Intro3() {
  return (
    <>
      <div className="p-16"></div>
      <div className="pb-10 text-center font-header text-3xl uppercase">
        get reminders <br /> based on your <br /> plant{"'"}s rhythm
      </div>
    </>
  )
}
