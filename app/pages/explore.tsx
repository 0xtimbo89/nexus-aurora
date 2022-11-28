import { HStack, VStack, Text, SimpleGrid } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ImageContainer from "@components/ImageContainer";
import styles from "@styles/Home.module.css";

const collections = [
  {
    description:
      "Journey is a wordless story told through gameplay and visual-only cutscenes.",
    name: "Journey",
    image:
      "https://bafybeic4e6qv3qggdy7ezgz5oghejfpzsfjeeq7nw7gj6zwhejpe7om4ja.ipfs.w3s.link/journey.png",
    creator: "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    address: "0x80E526b6bA7aB2C9Ad89Bc88E241a2D23D425F73",
  },
  {
    name: "Slender Man: The Arrival",
    description:
      "Slender Man is a fictional supernatural character that originated as a creepypasta Internet meme created by Something Awful forum user Eric Knudsen in 2009. He is depicted as a thin, unnaturally tall humanoid with a featureless head and face, wearing a black suit.",
    image:
      "https://bafybeihjy355g56qn35qwkdypbnrdrezg26antsxci5xg4qcmlg6uuas2a.ipfs.w3s.link/s.png",
    creator: "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    address: "0x0A197D7FF08a8110eC41e0934C69159505eF5A6D",
  },
  {
    name: "Pokemon 2022 (Melee Ver.)",
    description:
      "Pokémon are creatures of all shapes and sizes who live in the wild or alongside their human partners. During their adventures, Pokémon grow and become more experienced and even, on occasion, evolve into stronger Pokémon. Hundreds of known Pokémon inhabit the Pokémon universe, with untold numbers waiting to be discovered!",
    creator: "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    image:
      "https://bafybeifzqr6z4s5wqalnhy2warxknpoa4asaquom7cj4s22sbvnxbqisnq.ipfs.w3s.link/pokemon.png",
    address: "0x2506d1Ac00DfA924998ebc78C704E33E66a731D4",
  },
];

const trending = [
  {
    name: "Space Fighters (3rd Edition)",
    description:
      "Space fighters are small, maneuverable spacecraft designed for combat in space. They are equipped with weapons and armor, and often have powerful engines and maneuverability systems.",
    creator: "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    image:
      "https://bafybeicmjs4hm563kgu4r65qblocqq5nuvx3el337a3ayeww6ovcpwoo64.ipfs.w3s.link/fighter.png",
    address: "0x6a47f91b792a89858d4dd1fc6a59cff5b89be276",
  },
  {
    name: "Nexus Protocol Collection 3",
    description:
      "Nexus Protocol Collection is a collection for users on the platform to mint their own 3D metaverse assets.",
    creator: "0x6B4583438C24839ea459e34e9F21aD419A846B0b",
    image:
      "https://bafybeibkelaonwkpaerrpqhkifxlvxzlqj5dbdurxshalkfruykmxcscie.ipfs.w3s.link/nexus.png",
    address: "0x9D2a3158c9629a610e4885a23bcFD5B1ad8ca804",
  },
];

function Explore() {
  return (
    <VStack className={styles.main}>
      <VStack w="100%">
        <HStack className={styles.sectionTitleContainer}>
          <Text className={styles.sectionTitle}>Explore Collections</Text>
        </HStack>
        <Tabs
          colorScheme="#000000"
          size="lg"
          className={styles.tabContainer}
          variant="enclosed"
        >
          <TabList>
            <Tab w="100%">Games</Tab>
            <Tab w="100%">Trending</Tab>
            <Tab w="100%">Categories</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {collections.map(({ image, name, address }, idx) => (
                  <ImageContainer
                    key={idx}
                    image={image}
                    title={name}
                    h="400px"
                    link={`/collection/${address}`}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <SimpleGrid columns={3} w="100%" gap={3}>
                {trending.map(({ image, name, address }, idx) => (
                  <ImageContainer
                    key={idx}
                    image={image}
                    title={name}
                    h="400px"
                    link={`/collection/${address}`}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel>
              <VStack h="400px" justifyContent="center">
                <Text fontSize="20px">Coming soon...</Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
}

export default Explore;
