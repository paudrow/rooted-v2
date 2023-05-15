import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function OnBoarding() {
  return (
    <div className="flex h-screen flex-col items-center gap-4">
      <div className="absolute right-0 top-0 p-4">
        <ThemeToggle />
      </div>
      <div className="flex w-full max-w-md grow flex-col md:justify-around">
        <div className="flex flex-col items-center rounded-3xl py-20 md:py-32 md:dark:bg-grey">
          <div className="font-header text-4xl">RÖOTED</div>
          <div className="py-2" />
          <div className="font-subhead">
            only you can keep your plants alive
          </div>
          <div className="py-16" />
          <p className="text-center">
            Reminders to check on your plants <br />
            rooted in your past behavior. <br />
            No smart predictions, no wild guesses.
          </p>
          <div className="py-24" />
          <div className="flex flex-row gap-6">
            <Button>Sign up</Button>
            <Button>Sign in</Button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  )
}
