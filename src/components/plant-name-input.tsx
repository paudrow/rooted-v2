const FUN_PLANT_NAMES: string[] = [
  "Glorious Gloriousum",
  "Fantastic Ficus",
  "Bouncy Bamboo",
  "Ticklish Tulip",
  "Wiggly Willow",
  "Whimsical Wisteria",
  "Giggling Geranium",
  "Dancing Daisy",
  "Silly Sunflower",
  "Chuckling Cactus",
  "Playful Palm",
  "Laughing Lavender",
  "Swaying Succulent",
  "Jolly Jasmine",
  "Quirky Quince",
  "Hopping Hibiscus",
  "Wacky Watermelon",
  "Sprightly Spruce",
  "Cheery Cherry Blossom",
  "Grinning Grapevine",
  "Zany Zinnia",
  "Mischievous Maple",
]

export function PlantNameInput(props: {
  plantName: string
  setPlantName: (plantName: string) => void
}) {
  return (
    <>
      <label htmlFor="plant-name">Plant Name</label>
      <input
        id="plant-name"
        type="text"
        value={props.plantName}
        onChange={(e) => props.setPlantName(e.target.value)}
        placeholder={
          FUN_PLANT_NAMES[Math.floor(Math.random() * FUN_PLANT_NAMES.length)]
        }
      />
    </>
  )
}
