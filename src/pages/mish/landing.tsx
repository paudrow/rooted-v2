import Image from "next/image"
import { BellRing, HeartHandshake, MonitorSmartphone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Landing() {
  return (
    <div className="flex h-screen flex-col items-center gap-4 py-6">
      <div className="absolute right-0 top-0 p-4">
        <ThemeToggle />
      </div>
      <div className="font-header text-3xl">RÖOTED</div>
      <div>
        <div className="relative h-fit w-full">
          <img
            src="/landing-img.jpg"
            alt="Landing image"
            className="mix-blend-multiply dark:opacity-40 dark:mix-blend-difference"
          />
          <div className="absolute inset-x-10 top-10 flex w-full flex-col gap-6 lg:inset-x-1/5">
            <div className="font-subhead text-xl md:text-3xl">
              only you can keep your plants alive
            </div>
            <div>
              Reminders to check on your plants rooted in your past behavior.
              <br />
              No {'"'}smart{'"'} predictions, no wild guesses.
            </div>
            <Button className="w-fit">Learn more</Button>
          </div>
        </div>
        <div className="py-6" />
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-10 text-center md:max-w-3xl md:flex-row md:items-start">
            <div className="flex w-2/5 flex-col items-center gap-2">
              <HeartHandshake className="h-16 w-16" />
              <h1 className="text-center font-header text-2xl uppercase">
                embrace your expertise
              </h1>
              <p>
                We respect your knowledge and trust your judgement for your
                plant care.
              </p>
            </div>
            <div className="flex w-2/5 flex-col items-center gap-2">
              <MonitorSmartphone className="h-16 w-16" />
              <h1 className="text-center font-header text-2xl uppercase">
                Effortless Tracking
              </h1>
              <p>Quick & easy data entry to expedite your plant chores.</p>
            </div>
            <div className="flex w-2/5 flex-col items-center gap-2">
              <BellRing className="h-16 w-16" />
              <h1 className="text-center font-header text-2xl uppercase">
                Personalized notifications
              </h1>
              <p>
                We notify you based on <br />
                your past data and adjust with you to the seasons.
              </p>
            </div>
          </div>
          <Button>Get Rooted</Button>
          <div className="py-3" />
        </div>
        <div className="bg-slate-300">
          <h1 className="w-full py-6 text-center font-subhead text-2xl uppercase">
            Frequently asked questions
          </h1>

          <div className="grid grid-cols-3 gap-x-3 gap-y-8">
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
            <FaqEntry
              question="Why am I so cute?"
              answer="Because you're an expensive puppy"
            />
          </div>
          <div className="py-6" />
        </div>
      </div>
    </div>
  )
}

function FaqEntry(props: { question: string; answer: string }) {
  return (
    <div>
      <h2 className="font-subhead text-lg ">{props.question}</h2>
      <div className="-p-2" />
      <p>{props.answer}</p>
    </div>
  )
}
