import { useState } from "react"
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OnBoarding() {
  const [index, setIndex] = useState(0)

  const pages = [Tutorial1, Tutorial2]
  const getSection = () => {
    switch (index) {
      case 0:
        return <Tutorial1 />
      case 1:
        return <Tutorial2 />
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
          <div className="flex h-128 flex-col ">{getSection()}</div>
          <div className="flex flex-row gap-36">
            <Button
              onClick={() => {
                setIndex((index + 1) % pages.length)
              }}
            >
              How?
            </Button>
          </div>
          <div className="p-8" />
          <div className="flex flex-col gap-8 text-center opacity-70">
            {index !== 0 && (
              <div
                onClick={() => {
                  setIndex((pages.length + index - 1) % pages.length)
                }}
              >
                go back
              </div>
            )}
            <div>skip tutorial</div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}

function Tutorial1() {
  return (
    <div className="flex grow flex-col justify-center gap-8 px-4 text-center font-subhead">
      <p>Congrats on getting some plants!</p>
      <p>
        As you may have experienced already, plant keeping can be a bit finicky.
      </p>
      <p>
        You may have gotten some guidelines about when to water, but there are
        many factors that affects watering!
      </p>
      <p>
        It’s good to learn the needs of each plant, and tailor their care
        accordingly.
      </p>
      <p>So how do you know when a plant needs water?</p>
    </div>
  )
}

function Tutorial2() {
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
