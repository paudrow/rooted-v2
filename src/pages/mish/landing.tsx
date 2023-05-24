import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeartHandshake, BellRing, MonitorSmartphone } from "lucide-react"

export default function Landing() {
  return (
    <div className="flex h-screen flex-col items-center gap-4 p-6">
      <div className="absolute right-0 top-0 p-4">
        <ThemeToggle />
      </div>
      <div className="font-header text-3xl">RÖOTED</div>
      <div>
        <image> image </image>
        <div className="flex flex-col gap-6 py-10">
          <div className="font-subhead text-3xl">only you can keep your plants alive</div>
          <div>Reminders to check on your plants rooted in your past behavior.<br />
            No smart predictions, no wild guesses. </div>
          <Button className="w-fit">Learn more</Button>
        </div>
        <div className="flex md:flex-row flex-col md:max-w-2xl md:items-start items-center gap-6">
          <div className="flex flex-col items-center w-2/5 gap-2">
            <HeartHandshake className="w-16 h-16" />
            <h1 className="font-header uppercase text-2xl">embrace your expertise</h1>
            <p>We respect your knowledge and trust your judgement for your plant care.</p>
          </div>
          <div className="flex flex-col items-center w-2/5 gap-2">
            <MonitorSmartphone className="w-16 h-16" />
            <h1 className="font-header uppercase text-2xl">Effortless Tracking</h1>
            <p>Quick & easy data entry to expedite your plant chores.</p>
          </div>
          <div className="flex flex-col items-center w-2/5 gap-2">
            <BellRing className="w-16 h-16" />
            <h1 className="font-header uppercase text-2xl">Personalized notifications</h1>
            <p>We notify you based on your past plant care data.</p>
          </div>
        </div>
        <Button>Get Rooted</Button>
      </div>
    </div>
  )
}
