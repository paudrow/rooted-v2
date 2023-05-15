import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OnBoarding() {
  return (
    <div className="flex h-screen flex-col items-center gap-4">
      <div className="absolute right-0 top-0 p-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md grow flex-col md:justify-around">
        <div className="flex flex-col items-center rounded-3xl py-10 md:dark:bg-grey">
          <div className="font-header">RÖOTED</div>
          <div className="py-20"></div>
          <div className="text-center font-header text-3xl uppercase">
            Welcome!
          </div>
          <div className="py-10" />
          <div className="text-center">
            <div className="font-subhead">
              How experienced are you with plants?
            </div>
          </div>

          <div className="py-10" />

          <div className="flex flex-col items-center justify-center gap-6">
            <Button className="w-fit">I{"'"}m a beginner</Button>
            <Button className="w-fit">I know what I{"'"}m doing</Button>
          </div>
          <div className="py-20" />
          <div className="text-center opacity-70">skip tutorial</div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
